import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { ReportSummaryCard } from "./ReportSummaryCard";
import { getThemeColorPalette } from "../../theme/colors";
import { FailedReportSummaryCard } from "./FailedReportSummaryCard";

export const ReportSummary = ({
  averagedResults,
}: {
  averagedResults: AveragedTestCaseResult[];
}) => {
  const palette = getThemeColorPalette();
  const baselineResult = averagedResults[0];

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
            {result.status === "FAILURE" ? (
              <FailedReportSummaryCard averagedResult={result} />
            ) : (
              <ReportSummaryCard
                averagedResult={result}
                baselineResult={index !== 0 ? baselineResult : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
