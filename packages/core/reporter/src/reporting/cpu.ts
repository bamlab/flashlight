import { Measure, TestCaseIterationResult } from "@perf-profiler/types";
import _, { round } from "lodash";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { variationCoefficient } from "../utils/variationCoefficient";

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
    variationCoefficient: variationCoefficient(averageCpu, standardDeviation.deviation),
  };
};

export const getThreadsStats = (iterations: TestCaseIterationResult[]) => {
  const threads: { [threadName: string]: number[] } = {};

  iterations.forEach((iteration) => {
    const measure = _getAverageCpuUsagePerProcess(iteration.measures);
    measure.forEach((threadMeasure) => {
      if (!threads[threadMeasure.processName]) {
        threads[threadMeasure.processName] = [];
      }
      threads[threadMeasure.processName].push(threadMeasure.cpuUsage);
    });
  });

  const statsByThread: {
    [threadName: string]: {
      minMaxRange: [number, number];
      deviationRange: [number, number];
      variationCoefficient: number;
    };
  } = {};

  Object.keys(threads).forEach((threadName) => {
    const threadValues = threads[threadName];
    const threadAverage = threadValues.reduce((sum, value) => sum + value, 0) / threadValues.length;
    const threadStandardDeviation = getStandardDeviation({
      values: threadValues,
      average: threadAverage,
    });
    statsByThread[threadName] = {
      minMaxRange: getMinMax(threadValues),
      deviationRange: threadStandardDeviation.deviationRange,
      variationCoefficient: variationCoefficient(threadAverage, threadStandardDeviation.deviation),
    };
  });

  return statsByThread;
};
