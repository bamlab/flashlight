import React from "react";
import { Measure } from "android-performance-profiler";
import { CPUReport } from "./CPUReport";
import { ReportSummary } from "./ReportSummary";
import { RAMReport } from "./RAMReport";

const Report = ({ measures }: { measures: Measure[] }) => {
  return (
    <>
      <ReportSummary measures={measures} />
      <CPUReport measures={measures} />
      <RAMReport measures={measures} />
    </>
  );
};

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <>{measures.length > 1 ? <Report measures={measures} /> : null}</>
);
