import React from "react";
import { AveragedTestCaseResult, TestCaseResult } from "@perf-profiler/types";
import { ReportSummaryCard } from "./ReportSummaryCard";
import { getThemeColorPalette } from "../../components/Chart";

export const ReportSummary = ({
  results,
  averagedResults,
}: {
  results: TestCaseResult[];
  averagedResults: AveragedTestCaseResult[];
}) => {
  const palette = getThemeColorPalette();

  return (
    <div className="flex flex-row overflow-x-scroll px-12 gap-12 w-full hide-scrollbar">
      {averagedResults.map((result, index) => {
        const autoCenterCardsClassName = [
          index === 0 ? "ml-auto" : "",
          index === averagedResults.length - 1 ? "mr-auto" : "",
        ].join(" ");

        return (
          <div
            key={result.name}
            className={autoCenterCardsClassName}
            {...(averagedResults.length > 1
              ? { "data-theme": palette[index % palette.length] }
              : {})}
          >
            <ReportSummaryCard averagedResult={result} />
          </div>
        );
      })}
    </div>
  );
};
