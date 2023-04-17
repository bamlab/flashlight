import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  setVideoCurrentTime,
  useListenToVideoCurrentTime,
} from "./videoCurrentTimeContext";
import {
  Accordion,
  AccordionDetails,
  Button,
  ButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import { ITERATION_SELECTOR_HEIGHT } from "./components/IterationSelector";
import { TestCaseResult } from "@perf-profiler/types";

const getFileName = (path: string | undefined = ""): string => {
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
    <video
      ref={videoRef}
      width={VIDEO_SIZE.width}
      height={VIDEO_SIZE.height}
      controls
      style={{ backgroundColor: "black" }}
    >
      <source src={getFileName(video.path)} type="video/mp4" />
    </video>
  );
});

export const VideoSection = ({ results }: { results: TestCaseResult[] }) => {
  const theme = useTheme();
  const videoRefs = results.map(() => React.createRef<VideoHandle>());

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
    <>
      <div style={{ height: ITERATION_SELECTOR_HEIGHT }} />
      <Accordion
        defaultExpanded
        sx={{
          position: "fixed",
          bottom: ITERATION_SELECTOR_HEIGHT,
          right: 0,
          zIndex: 20,
          border: `2px solid ${theme.palette.grey[400]}`,
        }}
      >
        <AccordionSectionTitle title="Videos" />
        <AccordionDetails>
          {results.length > 1 ? (
            <ButtonGroup variant="contained" style={{ marginLeft: 10 }}>
              <Button color="secondary" onClick={resetVideos}>
                Reset
              </Button>
              <Button color="primary" onClick={playVideos}>
                Play all
              </Button>
            </ButtonGroup>
          ) : null}
          <div
            style={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            {results.map(({ name, iterations: [iteration] }, index) => {
              const video = iteration.videoInfos;

              return (
                <div key={index} style={{ width: VIDEO_SIZE.width }}>
                  {results.length > 1 ? (
                    <Typography
                      variant="h6"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      {name}
                    </Typography>
                  ) : null}
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
        </AccordionDetails>
      </Accordion>
    </>
  );
};
