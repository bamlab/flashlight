import { mapValues } from "lodash";
import { Measure } from "../Measure";
import { getCpuClockTick } from "./getCpuClockTick";
import { getSubProcessesStats, ProcessStat } from "./getCpuStatsByProcess";

const SYSTEM_TICK_IN_ONE_SECOND = getCpuClockTick();

class CpuMeasureAggregator {
  previousTotalCpuTimePerProcessId: { [processId: string]: number } = {};

  private groupCpuUsage(
    stats: ProcessStat[],
    groupByIteratee: (stat: ProcessStat) => string
  ): {
    [by: string]: number;
  } {
    const TICKS_FOR_TIME_INTERVAL = SYSTEM_TICK_IN_ONE_SECOND * TIME_INTERVAL_S;

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

  process(stats: ProcessStat[]): Measure {
    const cpuUsagePerCore = this.groupCpuUsage(
      stats,
      (stat: ProcessStat) => stat.cpuNumber
    );
    // Not exactly sure what cpu number-1 is, deleting for now
    delete cpuUsagePerCore["-1"];

    const cpuUsagePerProcessName = this.groupCpuUsage(
      stats,
      (stat: ProcessStat) => stat.processName
    );

    this.previousTotalCpuTimePerProcessId = stats.reduce(
      (aggr, curr) => ({
        ...aggr,
        [curr.processId]: curr.totalCpuTime,
      }),
      {}
    );

    return {
      perName: cpuUsagePerProcessName,
      perCore: cpuUsagePerCore,
    };
  }
}

const TIME_INTERVAL_S = 0.5;
export const pollCpuPerCoreUsage = (
  pidId: string,
  dataCallback: (data: Measure) => void
) => {
  let isFirstMeasure = true;

  const cpuMeasuresAggregator = new CpuMeasureAggregator();

  /**
   * TODO: using setInterval is probably a bad idea.
   * Should double check that the timings are accurate, otherwise
   * fallback to execute a loop in the device shell and ensure we can handle chunks of data
   **/
  const interval = setInterval(() => {
    const subProcessesStats = getSubProcessesStats(pidId);

    const cpuMeasures = cpuMeasuresAggregator.process(subProcessesStats);

    if (!isFirstMeasure) {
      dataCallback(cpuMeasures);
    }
    isFirstMeasure = false;
  }, TIME_INTERVAL_S * 1000);

  return {
    stop: () => clearInterval(interval),
  };
};
