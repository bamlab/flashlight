import React from "react";
import {
  AveragedTestCaseResult,
  Measure,
  TestCaseResult,
} from "@perf-profiler/types";
import { CPUReport } from "./CPUReport";
import { ReportSummary } from "./ReportSummary";
import { RAMReport } from "./RAMReport";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import styled from "@emotion/styled";
import { FPSReport } from "./FPSReport";

const Padding = styled.div`
  height: 10px;
`;

const Report = ({ results }: { results: TestCaseResult[] }) => {
  const averagedResults: AveragedTestCaseResult[] = results.map(
    averageTestCaseResult
  );

  return (
    <>
      <ReportSummary results={averagedResults} />
      <Padding />
      <Accordion>
        <AccordionSectionTitle title="FPS" />
        <AccordionDetails>
          <FPSReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSectionTitle title="CPU" />
        <AccordionDetails>
          <CPUReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSectionTitle title="RAM" />
        <AccordionDetails>
          <RAMReport results={averagedResults} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export const IterationsReporterView = ({
  results,
}: {
  results: TestCaseResult[];
}) => {
  return <Report results={results} />;
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
