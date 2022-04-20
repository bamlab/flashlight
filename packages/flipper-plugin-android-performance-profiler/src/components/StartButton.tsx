import { PlayArrow, Stop } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

export const StartButton = ({
  isMeasuring,
  start,
  stop,
}: {
  isMeasuring: boolean;
  start: () => void;
  stop: () => void;
}) =>
  isMeasuring ? (
    <Button
      variant="contained"
      color="secondary"
      onClick={stop}
      startIcon={<Stop />}
    >
      Stop Measuring
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={start}
      startIcon={<PlayArrow />}
    >
      Start Measuring
    </Button>
  );
