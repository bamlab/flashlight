import { Measure, TestCaseIterationResult } from "@perf-profiler/types";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { average } from "./averageIterations";
import { variationCoefficient } from "../utils/variationCoefficient";

export const getAverageRAMUsage = (measures: Measure[]) =>
  average(measures.map((measure) => measure.ram));

export const getRamStats = (iterations: TestCaseIterationResult[], averageRam?: number) => {
  if (!averageRam) return undefined;

  const values: number[] = [];
  iterations.forEach((iteration) => {
    const averageRamUsage = getAverageRAMUsage(iteration.measures);
    averageRamUsage && values.push(averageRamUsage);
  });

  const standardDeviation = getStandardDeviation({
    values,
    average: averageRam,
  });

  return {
    minMaxRange: getMinMax(values),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: variationCoefficient(averageRam, standardDeviation.deviation),
  };
};
