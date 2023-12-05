import { Measure, TestCaseIterationResult } from "@perf-profiler/types";
import _, { round } from "lodash";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { roundToDecimal } from "../utils/round";

const _getAverageCpuUsagePerProcess = (measures: Measure[]) =>
  _(measures)
    .map((measure) => measure.cpu)
    .map(({ perName }) =>
      Object.keys(perName).map((processName) => ({
        processName,
        cpuUsage: perName[processName],
      }))
    )
    .flatten()
    .groupBy((measure) => measure.processName)
    .map((measure, processName) => ({
      processName,
      cpuUsage: _.sumBy(measure, (measure) => measure.cpuUsage) / measures.length,
    }))
    .orderBy((measure) => measure.cpuUsage, "desc")
    .value();

export const getAverageCpuUsagePerProcess = (measures: Measure[]) =>
  _getAverageCpuUsagePerProcess(measures).map((measure) => ({
    ...measure,
    cpuUsage: round(measure.cpuUsage, 1),
  }));

export const getAverageCpuUsage = (measures: Measure[]) =>
  _getAverageCpuUsagePerProcess(measures).reduce<number>((sum, { cpuUsage }) => sum + cpuUsage, 0);

export const getStandardDeviationCPU = (
  iterations: TestCaseIterationResult[],
  averageCpu: number
): {
  deviation: number;
  deviationRange: [number, number];
} => {
  const averageCpuUsages = iterations.map((iteration) => getAverageCpuUsage(iteration.measures));
  return getStandardDeviation({
    values: averageCpuUsages,
    average: averageCpu,
  });
};

export const getMinMaxCPU = (iterations: TestCaseIterationResult[]): [number, number] => {
  const averageCpuUsages = iterations.map((iteration) => getAverageCpuUsage(iteration.measures));
  return getMinMax(averageCpuUsages);
};

export const getCpuStats = (iterations: TestCaseIterationResult[], averageCpu: number) => {
  const standardDeviation = getStandardDeviationCPU(iterations, averageCpu);
  return {
    minMaxRange: getMinMaxCPU(iterations),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: roundToDecimal((standardDeviation.deviation / averageCpu) * 100),
  };
};
