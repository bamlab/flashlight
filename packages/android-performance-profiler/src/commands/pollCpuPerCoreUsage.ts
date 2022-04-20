import { mapValues } from "lodash";
import { Measure } from "../Measure";
import { getCpuClockTick } from "./getCpuClockTick";
import { getSubProcessesStats, ProcessStat } from "./getSubProcessesStats";

export const pollCpuPerCoreUsage = (
  pidId: string,
  dataCallback: (data: Measure) => void
) => {
  let previousTotalCpuTimePerProcessId: { [processId: string]: number } = {};

  const TIME_INTERVAL_S = 0.5;
  let isFirstMeasure = true;

  const SYSTEM_TICK_IN_ONE_SECOND = getCpuClockTick();

  /**
   * TODO: using setInterval is probably a bad idea.
   * Should double check that the timings are accurate, otherwise
   * fallback to execute a loop in the device shell and ensure we can handle chunks of data
   **/
  const interval = setInterval(() => {
    const subProcessesStats = getSubProcessesStats(pidId);

    const TICKS_FOR_TIME_INTERVAL = SYSTEM_TICK_IN_ONE_SECOND * TIME_INTERVAL_S;
    const toPercentage = (value: number) =>
      Math.min((value * 100) / TICKS_FOR_TIME_INTERVAL, 100);

    const groupCpuUsage = (
      groupByIteratee: (stat: ProcessStat) => string
    ): { [by: string]: number } =>
      mapValues(
        subProcessesStats.reduce<{ [by: string]: number }>(
          (aggr, stat) => ({
            ...aggr,
            [groupByIteratee(stat)]:
              (aggr[groupByIteratee(stat)] || 0) +
              stat.totalCpuTime -
              (previousTotalCpuTimePerProcessId[stat.processId] || 0),
          }),
          {}
        ),
        toPercentage
      );

    const cpuUsagePerCore = groupCpuUsage(
      (stat: ProcessStat) => stat.cpuNumber
    );
    // Not exactly sure what cpu number-1 is, deleting for now
    delete cpuUsagePerCore["-1"];

    const cpuUsagePerProcessName = groupCpuUsage(
      (stat: ProcessStat) => stat.processName
    );

    if (!isFirstMeasure) {
      dataCallback({
        perName: cpuUsagePerProcessName,
        perCore: cpuUsagePerCore,
      });
    }
    isFirstMeasure = false;

    previousTotalCpuTimePerProcessId = subProcessesStats.reduce(
      (aggr, curr) => ({
        ...aggr,
        [curr.processId]: curr.totalCpuTime,
      }),
      {}
    );
  }, TIME_INTERVAL_S * 1000);

  return {
    stop: () => clearInterval(interval),
  };
};
