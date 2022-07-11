import React from "react";
import { Measure } from "@performance-profiler/types";
import { CPUReport } from "./CPUReport";
import { ReportSummary } from "./ReportSummary";
import { RAMReport } from "./RAMReport";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";

const Report = ({ measures }: { measures: Measure[] }) => {
  return (
    <>
      <ReportSummary measures={measures} />
      <Accordion>
        <AccordionSectionTitle title="CPU" />
        <AccordionDetails>
          <CPUReport measures={measures} />
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

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <>{measures.length > 1 ? <Report measures={measures} /> : null}</>
);
