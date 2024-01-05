import React from "react";
import { AveragedTestCaseResult, POLLING_INTERVAL } from "@perf-profiler/types";
import { Chart } from "../components/Charts/Chart";
import { buildValueGraph } from "./hideSectionForEmptyValue";

export const RAMReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const ram = buildValueGraph({
    results,
    stat: "ram",
  });

  return (
    <>
      <Chart title="RAM Usage (MB)" height={500} interval={POLLING_INTERVAL} series={ram} />
    </>
  );
};
