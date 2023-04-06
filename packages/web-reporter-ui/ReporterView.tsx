import React, { useReducer } from "react";
import {
  AveragedTestCaseResult,
  Measure,
  TestCaseResult,
} from "@perf-profiler/types";
import { CPUReport } from "./CPUReport";
import { ReportSummary } from "./components/ReportSummary/ReportSummary";
import { RAMReport } from "./RAMReport";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import styled from "@emotion/styled";
import { FPSReport } from "./FPSReport";
import { createTheme, ThemeProvider } from "@mui/material";
import Header from "./components/Header";

import { exportRawDataToZIP } from "./utils/reportRawDataExport";
import {
  IterationSelector,
  useIterationSelector,
} from "./components/IterationSelector";
import { VideosReport } from "./VideosReport";
import {
  PercentageContext,
  PercentageDispatchContext,
} from "./context/PercentageContext";
import { initialState, percentReducer } from "./reducers/percentageReducer";

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

  const [{ value }, dispatch] = useReducer(percentReducer, initialState);

  const averagedResults: AveragedTestCaseResult[] = iterationResults.map(
    averageTestCaseResult
  );

  const saveResultsToZIP = () => {
    exportRawDataToZIP(iterationResults);
  };

  return (
    <PercentageContext.Provider value={value}>
      <PercentageDispatchContext.Provider value={dispatch}>
        <Header saveToZIPCallBack={saveResultsToZIP} />
        <Padding />
        <ReportSummary results={results} averagedResults={averagedResults} />
        <Padding />
        <Accordion defaultExpanded>
          <AccordionSectionTitle title="Videos" />
          <AccordionDetails>
            <VideosReport results={averagedResults} />
          </AccordionDetails>
        </Accordion>
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
        <IterationSelector
          {...iterationSelector}
          iterationCount={minIterationCount}
        />
      </PercentageDispatchContext.Provider>
    </PercentageContext.Provider>
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
