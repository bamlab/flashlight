import { Measure, TestCaseIterationResult } from "@perf-profiler/types";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { average } from "./averageIterations";
import { variationCoefficient } from "../utils/variationCoefficient";

export const getAverageFPSUsage = (measures: Measure[]) =>
  average(measures.map((measure) => measure.fps));

export const getStandardDeviationFPS = (
  iterations: TestCaseIterationResult[],
  averageFps: number
) => {
  const averageFpsUsages: number[] = [];
  iterations.forEach((iteration) => {
    const value = getAverageFPSUsage(iteration.measures);
    value && averageFpsUsages.push(value);
  });
  return getStandardDeviation({ values: averageFpsUsages, average: averageFps });
};

const getMinMaxFPS = (iterations: TestCaseIterationResult[]): [number, number] => {
  const averageFpsUsages: number[] = [];
  iterations.forEach((iteration) => {
    const value = getAverageFPSUsage(iteration.measures);
    value && averageFpsUsages.push(value);
  });
  return getMinMax(averageFpsUsages);
};

export const getFpsStats = (iterations: TestCaseIterationResult[], averageFps?: number) => {
  if (!averageFps) return undefined;

  const standardDeviation = getStandardDeviationFPS(iterations, averageFps);
  return {
    minMaxRange: getMinMaxFPS(iterations),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: variationCoefficient(averageFps, standardDeviation.deviation),
  };
};
