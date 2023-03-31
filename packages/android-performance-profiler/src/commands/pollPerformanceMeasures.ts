import { Measure } from "@perf-profiler/types";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import { processOutput } from "./cpu/getCpuStatsByProcess";
import { processOutput as processRamOutput } from "./ram/pollRamUsage";
import { FrameTimeParser } from "./atrace/pollFpsUsage";
import { pollPerformanceMeasures as cppPollPerformanceMeasures } from "./cppProfiler";

export const pollPerformanceMeasures = (
  pid: string,
  dataCallback: (data: Measure) => void
) => {
  let initialTime: number | null = null;
  let previousTime: number | null = null;

  const cpuMeasuresAggregator = new CpuMeasureAggregator();
  const frameTimeParser = new FrameTimeParser();

  return cppPollPerformanceMeasures(
    pid,
    ({ cpu, ram: ramStr, atrace, timestamp }) => {
      const subProcessesStats = processOutput(cpu, pid);

      const ram = processRamOutput(ramStr);
      const { frameTimes, interval: atraceInterval } =
        frameTimeParser.getFrameTimes(atrace, pid);

      if (!initialTime) {
        initialTime = timestamp;
      }

      if (previousTime) {
        const interval = timestamp - previousTime;

        const cpuMeasures = cpuMeasuresAggregator.process(
          subProcessesStats,
          interval
        );

        const fps = FrameTimeParser.getFps(
          frameTimes,
          atraceInterval,
          Math.max(
            cpuMeasures.perName["UI Thread"] || 0,
            // Hack for Flutter apps - if this thread is heavy app will be laggy
            cpuMeasures.perName["(1.ui)"] || 0
          )
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
