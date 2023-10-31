import React from "react";
import { ReportSummaryCard } from "./ReportSummaryCard";
import { getThemeColorPalette } from "../../theme/colors";
import { FailedReportSummaryCard } from "./FailedReportSummaryCard";
import { Report } from "@perf-profiler/reporter";

export const ReportSummary = ({ reports }: { reports: Report[] }) => {
  const palette = getThemeColorPalette();
  const baselineReport = reports[0];

  return (
    <div className="flex flex-row overflow-x-scroll px-12 gap-12 w-full hide-scrollbar">
      {reports.map((report, index) => {
        const autoCenterCardsClassName = [
          index === 0 ? "ml-auto" : "",
          index === reports.length - 1 ? "mr-auto" : "",
        ].join(" ");

        return (
          <div
            key={report.name}
            className={autoCenterCardsClassName}
            {...(reports.length > 1 ? { "data-theme": palette[index % palette.length] } : {})}
          >
            {report.status === "FAILURE" ? (
              <FailedReportSummaryCard report={report} />
            ) : (
              <ReportSummaryCard
                report={report}
                baselineReport={index !== 0 ? baselineReport : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
