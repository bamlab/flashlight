import React from "react";
import { AveragedTestCaseResult, TestCaseResult } from "@perf-profiler/types";
import { ReportSummaryCard } from "./ReportSummaryCard";
import { themeColors } from "../../theme/useThemeColor";

export const ReportSummary = ({
  results,
  averagedResults,
}: {
  results: TestCaseResult[];
  averagedResults: AveragedTestCaseResult[];
}) => {
  return (
    <div className="flex flex-row overflow-x-scroll px-32 gap-24 w-full hide-scrollbar">
      {averagedResults.map((result, index) => (
        <div
          key={result.name}
          className="m-auto"
          {...(averagedResults.length > 1
            ? { "data-theme": themeColors[index % themeColors.length] }
            : {})}
        >
          <ReportSummaryCard averagedResult={result} />
        </div>
      ))}
    </div>
  );
};
