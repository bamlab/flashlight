import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { DeprecatedChart } from "../components/Charts/Chart";
import { buildValueGraph } from "./hideSectionForEmptyValue";

export const RAMReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const ram = buildValueGraph({
    results,
    stat: "ram",
  });

  return (
    <>
      <DeprecatedChart title="RAM Usage (MB)" height={500} series={ram} />
    </>
  );
};
