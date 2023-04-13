import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Button, Switch, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

export const useIterationSelector = (iterationCount: number) => {
  const [iterationIndex, setIterationIndex] = useState(0);
  const [showAverage, setShowAverage] = useState(true);

  return {
    iterationIndex,
    showAverage,
    setShowAverage,
    goToPreviousIteration: () =>
      setIterationIndex((iterationCount + iterationIndex - 1) % iterationCount),
    goToNextIteration: () =>
      setIterationIndex((iterationIndex + 1) % iterationCount),
  };
};

type IterationSelectorProps = {
  iterationCount: number;
  iterationIndex: number;
  showAverage: boolean;
  setShowAverage: (showAverage: boolean) => void;
  goToPreviousIteration: () => void;
  goToNextIteration: () => void;
};

export const ITERATION_SELECTOR_HEIGHT = 50;

const Footer = ({ children }: { children: React.ReactNode }) => {
  const footerColor = useTheme().palette.grey[400];

  return (
    <>
      <div style={{ height: ITERATION_SELECTOR_HEIGHT }} />
      <div
        style={{
          position: "fixed",
          backgroundColor: footerColor,
          boxShadow: `0px 0px ${
            ITERATION_SELECTOR_HEIGHT / 2
          }px 0px ${footerColor}`,
          left: 0,
          right: 0,
          bottom: 0,
          height: ITERATION_SELECTOR_HEIGHT,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </>
  );
};

export const IterationSelector = ({
  iterationCount,
  iterationIndex,
  showAverage,
  setShowAverage,
  goToPreviousIteration,
  goToNextIteration,
}: IterationSelectorProps) => {
  if (iterationCount <= 1) return null;

  return (
    <Footer>
      <Switch
        defaultChecked
        inputProps={{
          "aria-label": showAverage
            ? "Show each iteration individually"
            : "Show average",
        }}
        onChange={(_, checked) => setShowAverage(checked)}
      />
      {!showAverage && (
        <Button
          onClick={goToPreviousIteration}
          aria-label="See previous iteration"
        >
          <ArrowBackIosNewOutlined />
        </Button>
      )}
      <Typography
        color="#333"
        style={{
          textAlign: "center",
        }}
      >
        {showAverage ? (
          `Showing average of ${iterationCount} test iterations`
        ) : (
          <span>
            Iteration{" "}
            <span style={{ fontWeight: "bold" }}>{iterationIndex + 1}</span>/
            <span style={{ fontWeight: "bold" }}>{iterationCount}</span>
          </span>
        )}
      </Typography>
      {!showAverage && (
        <Button onClick={goToNextIteration} aria-label="See next iteration">
          <ArrowForwardIosOutlined />
        </Button>
      )}
    </Footer>
  );
};
