import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { Chart } from "../components/Chart";
import { roundToDecimal } from "../../utils/roundToDecimal";

export const FPSReport = ({
  results,
}: {
  results: AveragedTestCaseResult[];
}) => {
  const ram = results.map((result) => ({
    name: result.name,
    data: result.average.measures
      .map((measure) => measure.fps)
      .map((value, i) => ({
        x: i * 500,
        y: roundToDecimal(value, 0),
      })),
  }));

  return (
    <>
      <Chart title="FPS" height={500} interval={500} series={ram} />
    </>
  );
};
