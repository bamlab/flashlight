import React from "react";
import { AveragedTestCaseResult, TestCaseResult } from "@perf-profiler/types";
import { ReportSummaryCard } from "./ReportSummaryCard";

export const ReportSummary = ({
  results,
  averagedResults,
}: {
  results: TestCaseResult[];
  averagedResults: AveragedTestCaseResult[];
}) => {
  return (
    <div className="flex flex-row overflow-x-scroll px-32 pt-12 gap-24">
      {averagedResults.map((result) => (
        <ReportSummaryCard key={result.name} averagedResult={result} />
      ))}
    </div>
  );
};
