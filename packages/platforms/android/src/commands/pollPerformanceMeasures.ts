import { Measure, ThreadNames } from "@perf-profiler/types";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import { processOutput } from "./cpu/getCpuStatsByProcess";
import { processOutput as processRamOutput } from "./ram/pollRamUsage";
import { FrameTimeParser } from "./atrace/pollFpsUsage";
import { pollPerformanceMeasures as cppPollPerformanceMeasures } from "./cppProfiler";
import { Logger } from "@perf-profiler/logger";

export const pollPerformanceMeasures = (
  bundleId: string,
  {
    onMeasure,
    onStartMeasuring = () => {
      // noop by default
    },
  }: {
    onMeasure: (measure: Measure) => void;
    onStartMeasuring?: () => void;
  }
) => {
  let initialTime: number | null = null;
  let previousTime: number | null = null;

  let cpuMeasuresAggregator = new CpuMeasureAggregator();
  let frameTimeParser = new FrameTimeParser();

  const reset = () => {
    initialTime = null;
    previousTime = null;
    cpuMeasuresAggregator = new CpuMeasureAggregator();
    frameTimeParser = new FrameTimeParser();
  };

  return cppPollPerformanceMeasures(
    bundleId,
    ({ pid, cpu, ram: ramStr, atrace, timestamp }) => {
      if (!atrace) {
        Logger.debug("NO ATRACE OUTPUT, if the app is idle, that is normal");
      }
      const subProcessesStats = processOutput(cpu, pid);

      const ram = processRamOutput(ramStr);
      const { frameTimes, interval: atraceInterval } = frameTimeParser.getFrameTimes(atrace, pid);

      if (!initialTime) {
        initialTime = timestamp;
      }

      if (previousTime) {
        const interval = timestamp - previousTime;

        const cpuMeasures = cpuMeasuresAggregator.process(subProcessesStats, interval);

        const fps = FrameTimeParser.getFps(
          frameTimes,
          atraceInterval,
          Math.max(
            cpuMeasures.perName[ThreadNames.UI_THREAD] || 0,
            // Hack for Flutter apps - if this thread is heavy app will be laggy
            cpuMeasures.perName[ThreadNames.FLUTTER.UI] || 0
          )
        );

        // TODO: implement this better
        const SUPPORT_FPS = true;

        onMeasure(
          SUPPORT_FPS
            ? {
                cpu: cpuMeasures,
                fps,
                ram,
                time: timestamp - initialTime,
              }
            : {
                cpu: cpuMeasures,
                ram,
                time: timestamp - initialTime,
              }
        );
      } else {
        onStartMeasuring();
        cpuMeasuresAggregator.initStats(subProcessesStats);
      }
      previousTime = timestamp;
    },
    () => {
      Logger.warn("Process id has changed, ignoring measures until now");
      reset();
    }
  );
};
