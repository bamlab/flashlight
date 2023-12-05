import {
  Measure,
  POLLING_INTERVAL,
  TestCaseIterationResult,
  AveragedTestCaseResult,
} from "@perf-profiler/types";
import _ from "lodash";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { roundToDecimal } from "../utils/round";

export const getHighCpuUsage = (measures: Measure[], cpuUsageThreshold: number | undefined = 90) =>
  _(measures)
    .map((measure) => measure.cpu)
    .map(({ perName }) =>
      Object.keys(perName).map((processName) => ({
        processName,
        cpuUsage: perName[processName],
      }))
    )
    .flatten()
    .filter((measure) => measure.cpuUsage > cpuUsageThreshold)
    .groupBy((measure) => measure.processName)
    .mapValues((measures) => measures.length * POLLING_INTERVAL)
    .value();

export const getAverageTotalHighCPUUsage = (highCpuProcesses: { [processName: string]: number }) =>
  Object.keys(highCpuProcesses).reduce((sum, name) => sum + highCpuProcesses[name], 0);

export const getStandardDeviationHighCpu = (
  iterations: TestCaseIterationResult[],
  averageHighCpu: number
) => {
  const averageHighCpuUsages = iterations
    .map((iteration) => Object.values(getHighCpuUsage(iteration.measures)))
    .flat();
  return getStandardDeviation({
    values: averageHighCpuUsages,
    average: averageHighCpu,
  });
};

export const getMinMaxHighCpu = (iterations: TestCaseIterationResult[]): [number, number] => {
  const values = iterations
    .map((iteration) => Object.values(getHighCpuUsage(iteration.measures))[0])
    .flat();

  return getMinMax(values);
};

export const getHighCpuStats = (
  iterations: TestCaseIterationResult[],
  averageResultHighCpuUsage: AveragedTestCaseResult["averageHighCpuUsage"]
) => {
  const averageTotalHighCpu = getAverageTotalHighCPUUsage(averageResultHighCpuUsage);
  const standardDeviation = getStandardDeviationHighCpu(iterations, averageTotalHighCpu);
  console.log("iterations", iterations);
  return {
    minMaxRange: getMinMaxHighCpu(iterations),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: roundToDecimal((standardDeviation.deviation / averageTotalHighCpu) * 100),
  };
};
