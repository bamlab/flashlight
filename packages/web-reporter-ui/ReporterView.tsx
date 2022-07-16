import React from "react";
import { Measure, TestCaseIterationResult } from "@performance-profiler/types";
import { CPUReport } from "./CPUReport";
import { ReportSummary } from "./ReportSummary";
import { RAMReport } from "./RAMReport";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { averageIterations } from "@performance-profiler/reporter";

const Report = ({ iterations }: { iterations: TestCaseIterationResult[] }) => {
  const measures = averageIterations(iterations).measures;

  return (
    <>
      <ReportSummary measures={measures} iterations={iterations} />
      <Accordion>
        <AccordionSectionTitle title="CPU" />
        <AccordionDetails>
          <CPUReport measures={measures} iterations={[]} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSectionTitle title="RAM" />
        <AccordionDetails>
          <RAMReport measures={measures} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export const IterationsReporterView = ({
  results,
}: {
  results: TestCaseIterationResult[];
}) => {
  return <Report iterations={results} />;
};

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <>
    {measures.length > 1 ? (
      <IterationsReporterView
        results={[
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
        ]}
      />
    ) : null}
  </>
);
