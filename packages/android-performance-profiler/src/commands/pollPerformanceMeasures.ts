import { Logger } from "@perf-profiler/logger";
import { Measure } from "@perf-profiler/types";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import { processOutput } from "./cpu/getCpuStatsByProcess";
import { processOutput as processRamOutput } from "./ram/pollRamUsage";
import { processOutput as processFpsOutput } from "./gfxInfo/pollFpsUsage";
import { pollPerformanceMeasures as cppPollPerformanceMeasures } from "./cppProfiler";

export const pollPerformanceMeasures = (
  pid: string,
  dataCallback: (data: Measure) => void
) => {
  let initialTime: number | null = null;
  let previousTime: number | null = null;

  const cpuMeasuresAggregator = new CpuMeasureAggregator();

  return cppPollPerformanceMeasures(
    pid,
    ({ cpu, ram: ramStr, gfxinfo, timestamp, adbExecTime }) => {
      const subProcessesStats = processOutput(cpu, pid);

      const ram = processRamOutput(ramStr);
      const fps = processFpsOutput(gfxinfo);

      if (initialTime) {
        Logger.debug(`ADB Exec time:${adbExecTime}ms`);
      } else {
        initialTime = timestamp;
      }

      if (previousTime) {
        const interval = timestamp - previousTime;

        const cpuMeasures = cpuMeasuresAggregator.process(
          subProcessesStats,
          interval
        );
        dataCallback({
          cpu: cpuMeasures,
          fps,
          ram,
          time: timestamp - initialTime,
        });
      } else {
        cpuMeasuresAggregator.initStats(subProcessesStats);
      }
      previousTime = timestamp;
    }
  );
};
