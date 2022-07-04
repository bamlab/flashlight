import React from "react";
import { Measure } from "android-performance-profiler";
import { ScrollContainer } from "./components/ScrollContainer";
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
  <ScrollContainer>
    {measures.length > 1 ? <Report measures={measures} /> : null}
  </ScrollContainer>
);
