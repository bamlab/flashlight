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
    <div className="flex flex-row overflow-x-scroll px-32 pt-12">
      {averagedResults
        .map((result) => (
          <ReportSummaryCard key={result.name} averagedResult={result} />
        ))
        .reduce((acc, curr, index) => {
          if (index === 0) return [curr];
          return [...acc, <div className="w-24" />, curr];
        }, [] as React.ReactNode[])}
    </div>
  );
};
