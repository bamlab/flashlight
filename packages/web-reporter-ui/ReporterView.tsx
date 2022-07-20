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
import {
  averageHighCpuUsage,
  averageIterations,
} from "@perf-profiler/reporter";
import styled from "@emotion/styled";

const Padding = styled.div`
  height: 10px;
`;

const Report = ({ results }: { results: TestCaseResult[] }) => {
  const averagedResults: AveragedTestCaseResult[] = results.map((result) => {
    const averagedIterations = averageIterations(result.iterations);

    return {
      ...result,
      average: averagedIterations,
      averageHighCpuUsage: averageHighCpuUsage(result.iterations),
      reactNativeDetected: averagedIterations.measures.some((measure) =>
        Object.keys(measure.cpu.perName).some((key) => key === "(mqt_js)")
      ),
    };
  });

  return (
    <>
      <ReportSummary results={averagedResults} />
      <Padding />
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
                // Add dummy data for now
                time: 0,
                gfxInfo: {
                  frameCount: 0,
                  time: 0,
                  renderTime: 0,
                  histogram: [],
                },
              },
            ],
          },
        ]}
      />
    ) : null}
  </>
);
