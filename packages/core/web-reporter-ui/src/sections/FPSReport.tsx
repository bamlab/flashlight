import React from "react";
import { AveragedTestCaseResult, POLLING_INTERVAL } from "@perf-profiler/types";
import { Chart } from "../components/Charts/Chart";
import { buildValueGraph } from "./hideSectionForEmptyValue";

const fpsAnnotationInterval = [{ y: 57, y2: 60, color: "#158000", label: "Safe Zone" }];

export const FPSReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const fps = buildValueGraph({
    results,
    stat: "fps",
  });

  return (
    <Chart
      title="Frame rate (FPS)"
      height={500}
      interval={POLLING_INTERVAL}
      series={fps}
      annotationIntervalList={fpsAnnotationInterval}
    />
  );
};
