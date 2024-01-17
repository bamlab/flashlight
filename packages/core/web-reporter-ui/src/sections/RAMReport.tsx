import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { buildValueGraph } from "./hideSectionForEmptyValue";
import { ReportChart } from "../components/Charts/ReportChart";

export const RAMReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const ram = buildValueGraph({
    results,
    stat: "ram",
  });

  return <ReportChart title="RAM Usage (MB)" height={500} series={ram} />;
};
