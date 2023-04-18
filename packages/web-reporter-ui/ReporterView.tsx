import React from "react";
import {
  AveragedTestCaseResult,
  Measure,
  TestCaseResult,
} from "@perf-profiler/types";
import { CPUReport } from "./src/sections/CPUReport";
import { ReportSummary } from "./src/sections/ReportSummary";
import { RAMReport } from "./src/sections/RAMReport";
import { AccordionSectionTitle } from "./src/components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import styled from "@emotion/styled";
import { FPSReport } from "./src/sections/FPSReport";
import { createTheme, ThemeProvider } from "@mui/material";
import Header from "./src/components/Header";

import { exportRawDataToZIP } from "./utils/reportRawDataExport";
import {
  IterationSelector,
  useIterationSelector,
} from "./src/components/IterationSelector";
import { VideoSection } from "./src/sections/VideoSection";
import { VideoEnabledContext } from "./videoCurrentTimeContext";

const Padding = styled.div`
  height: 10px;
`;

const theme = createTheme({
  typography: {
    fontFamily: [
      "open-sans",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeightBold: 600,
  },
});

const Report = ({ results }: { results: TestCaseResult[] }) => {
  const minIterationCount = Math.min(
    ...results.map((result) => result.iterations.length)
  );
  const iterationSelector = useIterationSelector(minIterationCount);
  const iterationResults = results.map((result) => ({
    ...result,
    iterations: iterationSelector.showAverage
      ? result.iterations
      : [result.iterations[iterationSelector.iterationIndex]],
  }));

  const averagedResults: AveragedTestCaseResult[] = iterationResults.map(
    averageTestCaseResult
  );

  const saveResultsToZIP = () => {
    exportRawDataToZIP(iterationResults);
  };

  const hasVideos = !!iterationResults.some(
    (iteration) => iteration.iterations[0].videoInfos
  );

  return (
    <VideoEnabledContext.Provider value={hasVideos}>
      <Header saveToZIPCallBack={saveResultsToZIP} />
      <Padding />
      <ReportSummary results={results} averagedResults={averagedResults} />
      <Padding />

      <Accordion defaultExpanded>
        <AccordionSectionTitle title="FPS" />
        <AccordionDetails>
          <FPSReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSectionTitle title="CPU" />
        <AccordionDetails>
          <CPUReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSectionTitle title="RAM" />
        <AccordionDetails>
          <RAMReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
      {hasVideos ? <VideoSection results={iterationResults} /> : null}
      <IterationSelector
        {...iterationSelector}
        iterationCount={minIterationCount}
      />
    </VideoEnabledContext.Provider>
  );
};

export const IterationsReporterView = ({
  results,
}: {
  results: TestCaseResult[];
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Report results={results} />
    </ThemeProvider>
  );
};

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <>
    {measures.length > 1 ? (
      <IterationsReporterView
        results={[
          {
            name: "Results",
            iterations: [
              {
                measures,
                time: measures.length * 500,
              },
            ],
          },
        ]}
      />
    ) : null}
  </>
);
