import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { DeprecatedChart } from "../components/Charts/Chart";
import { buildValueGraph } from "./hideSectionForEmptyValue";

const fpsAnnotationInterval = [{ y: 57, y2: 60, color: "#158000", label: "Safe Zone" }];

export const FPSReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const fps = buildValueGraph({
    results,
    stat: "fps",
  });

  return (
    <DeprecatedChart
      title="Frame rate (FPS)"
      height={500}
      series={fps}
      annotationIntervalList={fpsAnnotationInterval}
    />
  );
};
