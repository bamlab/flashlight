import _ from "lodash";
import { Measure, POLLING_INTERVAL } from "@perf-profiler/types";
import { average } from "./averageIterations";

const round = (n: number, decimals: number) =>
  Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals);

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

export const getHighCpuUsageStats = (
  measures: Measure[],
  cpuUsageThreshold: number | undefined = 90
) =>
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

export const getAverageFPSUsage = (measures: Measure[]) =>
  average(measures.map((measure) => measure.fps));

export const getAverageRAMUsage = (measures: Measure[]) =>
  average(measures.map((measure) => measure.ram));

export const getAverageTotalHighCPUUsage = (highCpuProcesses: { [processName: string]: number }) =>
  Object.keys(highCpuProcesses).reduce((sum, name) => sum + highCpuProcesses[name], 0);
