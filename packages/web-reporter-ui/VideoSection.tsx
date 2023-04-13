import React, { useEffect, useRef } from "react";
import { useVideoCurrentTime } from "./videoCurrentTimeContext";
import {
  Accordion,
  AccordionDetails,
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

const Video = ({
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

export const VideoSection = ({
  videoInfos,
  results,
}: {
  results: TestCaseResult[];
  videoInfos: (
    | {
        path: string;
        startOffset: number;
      }
    | undefined
  )[];
}) => {
  const theme = useTheme();

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
          <div style={{ flexDirection: "row", display: "flex" }}>
            {results.map(({ name }, index) => {
              const video = videoInfos[index];
              return (
                <div key={index}>
                  <Typography variant="h6">{name}</Typography>
                  {video ? <Video video={video} /> : null}
                </div>
              );
            })}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
