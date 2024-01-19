import {
  Measure,
  POLLING_INTERVAL,
  TestCaseIterationResult,
  AveragedTestCaseResult,
} from "@perf-profiler/types";
import _ from "lodash";
import { getMinMax } from "../utils/getMinMax";
import { getStandardDeviation } from "../utils/getStandardDeviation";
import { variationCoefficient } from "../utils/variationCoefficient";

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

const getStatsByThread = (iterations: TestCaseIterationResult[]) => {
  const threads: { [threadName: string]: number[] } = {};
  iterations.forEach((iteration) => {
    const measure = getHighCpuUsage(iteration.measures);
    Object.keys(measure).forEach((threadName) => {
      if (!threads[threadName]) {
        threads[threadName] = [];
      }
      threads[threadName].push(measure[threadName]);
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
    threads: getStatsByThread(iterations),
    minMaxRange: getMinMax(averageTotalHighCPuUsage),
    deviationRange: standardDeviation.deviationRange,
    variationCoefficient: variationCoefficient(averageTotalHighCpu, standardDeviation.deviation),
  };
};

// We compute every time unless there is only one thread and it's called "Total"
export const canComputeHighCpuUsage = (testCaseResult: AveragedTestCaseResult) => {
  if (testCaseResult.average.measures.length === 0) {
    return true;
  }
  const lastMeasure = testCaseResult.average.measures[testCaseResult.average.measures.length - 1];
  const threads = Object.keys(lastMeasure.cpu.perName);
  if (threads.length === 1 && threads[0] === "Total") return false;
  return true;
};
