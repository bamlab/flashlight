import { mapValues } from "lodash";
import { CpuMeasure as Measure } from "@perf-profiler/types";
import { getCpuClockTick } from "../cppProfiler";
import { ProcessStat } from "./getCpuStatsByProcess";

const SYSTEM_TICK_IN_ONE_SECOND = getCpuClockTick();

export class CpuMeasureAggregator {
  private previousTotalCpuTimePerProcessId: { [processId: string]: number } =
    {};

  private groupCpuUsage(
    stats: ProcessStat[],
    groupByIteratee: (stat: ProcessStat) => string,
    timeInterval: number
  ): {
    [by: string]: number;
  } {
    const TICKS_FOR_TIME_INTERVAL =
      (SYSTEM_TICK_IN_ONE_SECOND * timeInterval) / 1000;

    const toPercentage = (value: number) =>
      Math.min((value * 100) / TICKS_FOR_TIME_INTERVAL, 100);

    return mapValues(
      stats.reduce<{ [by: string]: number }>(
        (aggr, stat) => ({
          ...aggr,
          [groupByIteratee(stat)]:
            (aggr[groupByIteratee(stat)] || 0) +
            stat.totalCpuTime -
            (this.previousTotalCpuTimePerProcessId[stat.processId] || 0),
        }),
        {}
      ),
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
    // Not exactly sure what cpu number-1 is, deleting for now
    delete cpuUsagePerCore["-1"];

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
