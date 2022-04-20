import _ from "lodash";
import { Measure } from "../Measure";

const round = (n: number, decimals: number) =>
  Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals);

export const getAverageCpuUsagePerProcess = (measures: Measure[]) =>
  _(measures)
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
      cpuUsage: round(
        _.sumBy(measure, (measure) => measure.cpuUsage) / measures.length,
        1
      ),
    }))
    .orderBy((measure) => measure.cpuUsage, "desc")
    .value();

export const getAverageCpuUsage = (measures: Measure[]) =>
  getAverageCpuUsagePerProcess(measures).reduce<number>(
    (sum, { cpuUsage }) => sum + cpuUsage,
    0
  );

export const getHighCpuUsageStats = (
  measures: Measure[],
  cpuUsageThreshold: number
) =>
  _(measures)
    .map(({ perName }) =>
      Object.keys(perName).map((processName) => ({
        processName,
        cpuUsage: perName[processName],
      }))
    )
    .flatten()
    .filter((measure) => measure.cpuUsage > cpuUsageThreshold)
    .groupBy((measure) => measure.processName)
    .value();
