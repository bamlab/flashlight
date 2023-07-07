import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { setVideoCurrentTime, useListenToVideoCurrentTime } from "../../videoCurrentTimeContext";
import { TestCaseResult } from "@perf-profiler/types";
import { Button } from "../components/Button";
import { ArrowDownIcon } from "../components/icons/ArrowDownIcon";

const getFileName = (path: string | undefined = ""): string => {
  if (path.startsWith("http")) {
    return path;
  }

  const split = path.split("/");
  if (split.length === 1) {
    return path;
  }
  const title = split[split.length - 1];
  return title;
};

const VIDEO_SIZE = {
  width: 300,
  height: 500,
};

type VideoHandle = {
  play: () => void;
};

const Video = forwardRef<
  VideoHandle,
  {
    video: {
      path: string;
      startOffset: number;
    };
  }
>(({ video }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.play();
      }
    },
  }));

  useListenToVideoCurrentTime(
    useCallback(
      (time) => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.currentTime = (time + video.startOffset) / 1000;
        }
      },
      [video.startOffset]
    )
  );

  return (
    <div className="flex flex-1 relative">
      <video
        ref={videoRef}
        controls
        className="bg-black w-full h-full absolute top-0 bottom-0 left-0 right-0"
      >
        <source src={getFileName(video.path)} type="video/mp4" />
      </video>
    </div>
  );
});

export const VideoSection = ({ results }: { results: TestCaseResult[] }) => {
  const videoRefs = results.map(() => React.createRef<VideoHandle>());
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const togglePanel = () => setIsPanelExpanded((prevIsPanelExpanded) => !prevIsPanelExpanded);

  const resetVideos = () => {
    // Nice to start a bit before start of measures to see app opening for instance
    setVideoCurrentTime(-500);
  };

  const playVideos = () => {
    videoRefs.forEach((videoRef) => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    });
  };

  useEffect(() => {
    resetVideos();
  }, []);

  return (
    <div
      className={`flex flex-row flex-nowrap h-full justify-center bg-dark-charcoal overflow-auto py-8 flex-shrink-0 transition-[max-width] ${
        isPanelExpanded ? "max-w-[24px]" : "max-w-[50vw]"
      }`}
    >
      <div className="self-center py-8 cursor-pointer" onClick={togglePanel}>
        <ArrowDownIcon
          size={24}
          className={`transition-transform ease-linear ${
            isPanelExpanded ? "rotate-90" : "-rotate-90"
          }`}
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <div className="flex flex-row">
          {results.length > 1 ? (
            <div className="flex flex-row">
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  resetVideos();
                }}
              >
                Reset
              </Button>
              <div className="w-2" />
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  playVideos();
                }}
              >
                Play all
              </Button>
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-row max-h-[600px] gap-4 overflow-scroll pr-6">
          {results.map(({ name, iterations: [iteration] }, index) => {
            const video = iteration.videoInfos;

            return (
              <div key={index} style={{ width: VIDEO_SIZE.width }} className="flex flex-col">
                {results.length > 1 ? <h6 className="text-white truncate m-1">{name}</h6> : null}
                {video ? (
                  <Video
                    video={{
                      ...video,
                      startOffset:
                        /**
                         * Point for x = 0 in the graph actually corresponds to the first 500ms of measure
                         * So we need to add 500ms (iteration.measures[0].time) to the startOffset to
                         * have the video start at the right time
                         *
                         * we divide by 2 at the moment to center the measure in the video but we should
                         * rethink how we display the graph
                         */
                        video.startOffset + iteration.measures[0].time / 2,
                    }}
                    key={video.path}
                    ref={videoRefs[index]}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
