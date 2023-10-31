import React from "react";
import { AveragedTestCaseResult, POLLING_INTERVAL } from "@perf-profiler/types";
import { Chart } from "../components/Chart";
import { roundToDecimal } from "@perf-profiler/reporter";

export const RAMReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const ram = results.map((result) => ({
    name: result.name,
    data: result.average.measures
      .map((measure) => measure.ram)
      .map((value, i) => ({
        x: i * POLLING_INTERVAL,
        y: roundToDecimal(value, 0),
      })),
  }));

  return (
    <>
      <Chart title="RAM Usage (MB)" height={500} interval={POLLING_INTERVAL} series={ram} />
    </>
  );
};
