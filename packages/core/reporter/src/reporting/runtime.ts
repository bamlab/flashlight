import { TestCaseIterationResult } from "@perf-profiler/types";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { roundToDecimal } from "../utils/round";

export const getRuntimeStats = (iterations: TestCaseIterationResult[], averageRuntime: number) => {
  const values = iterations.map((iteration) => iteration.time);
  const standardDeviation = getStandardDeviation({
    values,
    average: averageRuntime,
  });

  return {
    minMaxRange: getMinMax(values),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: roundToDecimal((standardDeviation.deviation / averageRuntime) * 100),
  };
};
