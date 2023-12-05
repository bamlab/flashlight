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

export const getHighCpuStats = (
  iterations: TestCaseIterationResult[],
  averageResultHighCpuUsage: AveragedTestCaseResult["averageHighCpuUsage"]
) => {
  const averageTotalHighCpu = getAverageTotalHighCPUUsage(averageResultHighCpuUsage);

  const averageTotalHighCPuUsage = iterations.map((iteration) =>
    getAverageTotalHighCPUUsage(getHighCpuUsage(iteration.measures))
  );

  const standardDeviation = getStandardDeviation({
    values: averageTotalHighCPuUsage,
    average: averageTotalHighCpu,
  });

  return {
    minMaxRange: getMinMax(averageTotalHighCPuUsage),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: roundToDecimal((standardDeviation.deviation / averageTotalHighCpu) * 100),
  };
};
