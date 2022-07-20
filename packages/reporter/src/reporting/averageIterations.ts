import { Measure, TestCaseIterationResult } from "@perf-profiler/types";
import { mapValues } from "lodash";
import { getHighCpuUsageStats } from "./reporting";

const range = (n: number) =>
  Array(n)
    .fill(null)
    .map((_, i) => i);

const average = (arr: number[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

const averageMaps = (
  maps: { [key: string]: number }[]
): { [key: string]: number } => {
  const totalByThread = maps.reduce((aggr, map) => {
    Object.keys(map).forEach((key) => {
      aggr[key] = aggr[key] || 0;
      aggr[key] += map[key];
    });
    return aggr;
  }, {});

  return mapValues(totalByThread, (value) => value / maps.length);
};

const averageMeasures = (measures: Measure[]): Measure => {
  return {
    cpu: {
      perCore: {},
      perName: averageMaps(measures.map((m) => m.cpu.perName)),
    },
    ram: average(measures.map((m) => m.ram)),
    time: 500,
  };
};

export const averageIterations = (
  results: TestCaseIterationResult[]
): TestCaseIterationResult => {
  const minLength = Math.min(
    ...results.map((result) => result.measures.length)
  );

  return {
    measures: range(minLength).map((i) =>
      averageMeasures(results.map((result) => result.measures[i]))
    ),
    time: average(results.map((result) => result.time)),
    // Rest is not implemented yet
    gfxInfo: {
      frameCount: 0,
      time: 0,
      renderTime: 0,
      histogram: [],
    },
  };
};

export const averageHighCpuUsage = (
  results: TestCaseIterationResult[],
  cpuUsageThreshold = 90
) => {
  return averageMaps(
    results.map((result) =>
      getHighCpuUsageStats(result.measures, cpuUsageThreshold)
    )
  );
};
