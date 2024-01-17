import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { buildValueGraph } from "./hideSectionForEmptyValue";
import { ReportChart } from "../components/Charts/ReportChart";

const fpsAnnotationInterval = [{ y: 57, y2: 60, color: "#158000", label: "Safe Zone" }];

export const FPSReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const fps = buildValueGraph({
    results,
    stat: "fps",
  });

  return (
    <ReportChart
      title="Frame rate (FPS)"
      height={500}
      series={fps}
      annotationIntervalList={fpsAnnotationInterval}
    />
  );
};
