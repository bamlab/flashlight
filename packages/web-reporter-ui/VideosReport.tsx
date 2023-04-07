import { AveragedTestCaseResult } from "@perf-profiler/types";
import React, { useContext, useEffect, useRef } from "react";
import { PercentageContext } from "./context/PercentageContext";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const VideoUrl = new URL("../result_1.mp4", import.meta.url);

const getFileName = (path: string | undefined = ""): string => {
  const split = path.split("/");
  if (split.length === 1) {
    return path;
  }
  const title = split[split.length - 1];
  return title;
};

export const VideosReport = ({
  results,
}: {
  results: AveragedTestCaseResult[];
}) => {
  const percentage = useContext(PercentageContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [iteration, setIteration] = React.useState(0);

  const changeIteration = () => {
    console.log(iteration, results[0].iterations.length, results.length);
    if (iteration === results[0].iterations.length - 1) {
      setIteration(0);
      return;
    }
    setIteration(iteration + 1);
  };

  useEffect(() => {
    const handleMetadataLoaded = () => {
      setIsVideoLoaded(true);
    };

    if (videoRef.current && !isVideoLoaded) {
      videoRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);
    }

    if (videoRef.current && isVideoLoaded) {
      const videoOffset =
        results[0].iterations[iteration].videoInfos?.startOffset || 0;
      const measureDuration =
        results[0].iterations[iteration].videoInfos?.measureDuration || 0;
      const adjustedVideoDuration = measureDuration / 1000;
      const newTime =
        (adjustedVideoDuration * percentage) / 100 + videoOffset / 1000;
      if (typeof newTime !== "number") return;
      videoRef.current.currentTime = newTime;
      videoRef.current.play();

      const endTime = videoOffset / 1000 + adjustedVideoDuration;

      const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= endTime) {
          videoRef.current.pause();
        }
      };

      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleMetadataLoaded
          );
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [percentage, isVideoLoaded, iteration, results]);

  if (!results[0].iterations[iteration].videoInfos) return null;

  return (
    <>
      <video key={iteration} ref={videoRef} width="750" height="500" controls>
        <source
          src={getFileName(results[0].iterations[iteration].videoInfos?.path)}
          type="video/mp4"
        />
      </video>
      <button onClick={changeIteration}> Iterate HERE {iteration} </button>
    </>
  );
};
