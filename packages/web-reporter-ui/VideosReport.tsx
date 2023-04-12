import React, { useEffect, useRef } from "react";
import { useVideoCurrentTime } from "./videoCurrentTimeContext";

const getFileName = (path: string | undefined = ""): string => {
  const split = path.split("/");
  if (split.length === 1) {
    return path;
  }
  const title = split[split.length - 1];
  return title;
};

export const VideosReport = ({
  video,
}: {
  video: {
    path: string;
    startOffset: number;
  };
}) => {
  const currentTime = useVideoCurrentTime();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.currentTime = (currentTime + video.startOffset) / 1000;
    }
  }, [currentTime, video.startOffset]);

  return (
    <video
      ref={videoRef}
      width="300"
      height="500"
      controls
      style={{ backgroundColor: "black" }}
    >
      <source src={getFileName(video.path)} type="video/mp4" />
    </video>
  );
};
