import React, { useMemo } from "react";
import { Report as ReportModel } from "@perf-profiler/reporter";
import { buildValueGraph } from "./hideSectionForEmptyValue";
import { ReportChart } from "../components/Charts/ReportChart";

export const FPSReport = ({ reports }: { reports: ReportModel[] }) => {
  const fps = buildValueGraph({
    results: reports.map((report) => report.getAveragedResult()),
    stat: "fps",
  });

  const fpsAnnotationInterval = useMemo(() => {
    const targetFps = reports[0].getRefreshRate();

    return [
      { y: Math.floor(0.95 * targetFps), y2: targetFps, color: "#158000", label: "Safe Zone" },
    ];
  }, [reports]);

  return (
    <ReportChart
      title="Frame rate (FPS)"
      height={500}
      series={fps}
      annotationIntervalList={fpsAnnotationInterval}
    />
  );
};
