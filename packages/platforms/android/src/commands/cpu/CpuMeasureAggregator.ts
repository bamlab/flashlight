import { mapValues } from "lodash";
import { CpuMeasure as Measure } from "@perf-profiler/types";
import { ProcessStat } from "./getCpuStatsByProcess";

export class CpuMeasureAggregator {
  private previousTotalCpuTimePerProcessId: { [processId: string]: number } = {};

  constructor(private cpuClockTick: number) {}

  private groupCpuUsage(
    stats: ProcessStat[],
    groupByIteratee: (stat: ProcessStat) => string,
    timeInterval: number
  ): {
    [by: string]: number;
  } {
    const TICKS_FOR_TIME_INTERVAL = (this.cpuClockTick * timeInterval) / 1000;

    const toPercentage = (value: number) => Math.min((value * 100) / TICKS_FOR_TIME_INTERVAL, 100);

    return mapValues(
      stats.reduce<{ [by: string]: number }>((aggr, stat) => {
        const cpuTimeDiff =
          stat.totalCpuTime - (this.previousTotalCpuTimePerProcessId[stat.processId] || 0);

        return {
          ...aggr,
          [groupByIteratee(stat)]:
            (aggr[groupByIteratee(stat)] || 0) +
            // if the diff is < 0, likely the process was restarted
            // so we count the new cpu time
            (cpuTimeDiff >= 0 ? cpuTimeDiff : stat.totalCpuTime),
        };
      }, {}),
      toPercentage
    );
  }

  initStats(stats: ProcessStat[]): void {
    this.previousTotalCpuTimePerProcessId = stats.reduce(
      (aggr, curr) => ({
        ...aggr,
        [curr.processId]: curr.totalCpuTime,
      }),
      {}
    );
  }

  process(stats: ProcessStat[], interval: number): Measure {
    const cpuUsagePerCore = this.groupCpuUsage(
      stats,
      (stat: ProcessStat) => stat.cpuNumber,
      interval
    );

    const cpuUsagePerProcessName = this.groupCpuUsage(
      stats,
      (stat: ProcessStat) => stat.processName,
      interval
    );

    this.initStats(stats);

    return {
      perName: cpuUsagePerProcessName,
      perCore: cpuUsagePerCore,
    };
  }
}
