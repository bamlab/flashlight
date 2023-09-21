import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { Switch } from "./Switch";

export const useIterationSelector = (iterationCount: number) => {
  const [iterationIndex, setIterationIndex] = useState(0);
  const [showAverage, setShowAverage] = useState(true);

  return {
    iterationIndex,
    showAverage,
    setShowAverage,
    goToPreviousIteration: () =>
      setIterationIndex((iterationCount + iterationIndex - 1) % iterationCount),
    goToNextIteration: () => setIterationIndex((iterationIndex + 1) % iterationCount),
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
  return (
    <>
      <div style={{ height: ITERATION_SELECTOR_HEIGHT }} />
      <div
        className="bg-dark-charcoal fixed items-center justify-center flex w-full bottom-0 left-0 right-0 shadow-lg z-50"
        style={{
          height: ITERATION_SELECTOR_HEIGHT,
          boxShadow: `0px 0px ${ITERATION_SELECTOR_HEIGHT / 2}px 0px rgb(19 19 19)`,
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
        value={showAverage}
        onChange={setShowAverage}
        accessibilityLabel={showAverage ? "Show each iteration individually" : "Show average"}
      />
      <div className="w-4" />
      {!showAverage && (
        <button
          aria-label="See previous iteration"
          onClick={goToPreviousIteration}
          className="ml-2 mr-2"
        >
          <ArrowBackIosNewOutlined className="text-theme-color" />
        </button>
      )}
      <div className="text-[#8B8B8B] font-medium">
        {showAverage ? (
          `Showing average of ${iterationCount} test iterations`
        ) : (
          <span>
            Iteration <span style={{ fontWeight: "bold" }}>{iterationIndex + 1}</span>/
            <span style={{ fontWeight: "bold" }}>{iterationCount}</span>
          </span>
        )}
      </div>
      {!showAverage && (
        <button onClick={goToNextIteration} aria-label="See next iteration" className="ml-2 mr-2">
          <ArrowForwardIosOutlined className="text-theme-color" />
        </button>
      )}
    </Footer>
  );
};
