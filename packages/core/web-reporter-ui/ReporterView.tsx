import React, { useMemo } from "react";
import { Measure, POLLING_INTERVAL, TestCaseResult, DeviceSpecs } from "@perf-profiler/types";
import { CPUReport } from "./src/sections/CPUReport";
import { ReportSummary } from "./src/sections/ReportSummary/ReportSummary.component";
import { RAMReport } from "./src/sections/RAMReport";
import { Report as ReportModel } from "@perf-profiler/reporter";
import styled from "@emotion/styled";
import { FPSReport } from "./src/sections/FPSReport";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Header, MenuOption } from "./src/components/Header";
import { exportRawDataToZIP } from "./utils/reportRawDataExport";
import { IterationSelector, useIterationSelector } from "./src/components/IterationSelector";
import { VideoSection } from "./src/sections/VideoSection";
import { VideoEnabledContext } from "./videoCurrentTimeContext";
import { HideSectionIfUndefinedValueFound } from "./src/sections/hideSectionForEmptyValue";
import { mapThreadNames } from "./src/sections/threads";

const Padding = styled.div`
  height: 10px;
`;

const theme = createTheme({
  typography: {
    fontFamily: ["open-sans", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    fontWeightBold: 600,
  },
});

const Report = ({
  results: rawResults,
  additionalMenuOptions,
  deviceSpecs,
}: {
  results: TestCaseResult[];
  additionalMenuOptions?: MenuOption[];
  deviceSpecs: DeviceSpecs;
}) => {
  const results = mapThreadNames(rawResults);
  const reports = useMemo(
    () => results.map((result) => new ReportModel(result, deviceSpecs)),
    [results, deviceSpecs]
  );
  const minIterationCount = Math.min(...reports.map((report) => report.getIterationCount()));
  const iterationSelector = useIterationSelector(minIterationCount);

  const selectedReports = iterationSelector.showAverage
    ? reports
    : reports.map((report) => report.selectIteration(iterationSelector.iterationIndex));

  const averagedResults = selectedReports.map((report) => report.getAveragedResult());

  const hasVideos = !!selectedReports.some((report) => report.hasVideos());
  const hasMeasures = selectedReports[0].hasMeasures();

  return (
    <>
      <VideoEnabledContext.Provider value={hasVideos}>
        <div className="flex flex-row w-full h-[calc(100%-50px)] overflow-y-hidden">
          <div className="overflow-auto w-full">
            <Header
              menuOptions={[
                {
                  label: "Save all as ZIP",
                  icon: <FileDownloadIcon fontSize="small" />,
                  onClick: () => {
                    exportRawDataToZIP(results);
                  },
                },
                ...(additionalMenuOptions ? additionalMenuOptions : []),
              ]}
            />
            <Padding />
            <ReportSummary reports={selectedReports} deviceSpecs={deviceSpecs} />
            <div className="h-16" />

            {hasMeasures ? (
              <>
                <HideSectionIfUndefinedValueFound>
                  <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
                    <FPSReport results={averagedResults} />
                  </div>
                  <div className="h-10" />
                </HideSectionIfUndefinedValueFound>

                <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
                  <CPUReport results={averagedResults} />
                </div>
                <div className="h-10" />

                <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
                  <RAMReport results={averagedResults} />
                </div>
                <div className="h-10" />
              </>
            ) : null}
          </div>

          {hasVideos ? <VideoSection results={averagedResults} /> : null}
        </div>
      </VideoEnabledContext.Provider>

      <IterationSelector {...iterationSelector} iterationCount={minIterationCount} />
    </>
  );
};

export const IterationsReporterView = ({
  results,
  additionalMenuOptions,
  deviceSpecs,
}: {
  results: TestCaseResult[];
  additionalMenuOptions?: MenuOption[];
  deviceSpecs: DeviceSpecs;
}) => {
  return results.length > 0 ? (
    <ThemeProvider theme={theme}>
      <Report
        deviceSpecs={deviceSpecs}
        results={results}
        additionalMenuOptions={additionalMenuOptions}
      />
    </ThemeProvider>
  ) : null;
};

export const ReporterView = ({
  measures,
  deviceSpecs,
}: {
  measures: Measure[];
  deviceSpecs: DeviceSpecs;
}) => (
  <>
    {measures.length > 1 ? (
      <IterationsReporterView
        deviceSpecs={deviceSpecs}
        results={[
          {
            name: "Results",
            status: "SUCCESS",
            iterations: [
              {
                measures,
                time: measures.length * POLLING_INTERVAL,
                status: "SUCCESS",
              },
            ],
          },
        ]}
      />
    ) : null}
  </>
);
