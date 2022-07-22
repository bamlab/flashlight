import { Logger } from "@perf-profiler/logger";
import { Measure } from "@perf-profiler/types";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import {
  getCommand as getCpuCommand,
  processOutput,
} from "./cpu/getCpuStatsByProcess";
import {
  getCommand as getRamCommand,
  processOutput as processRamOutput,
} from "./ram/pollRamUsage";
import {
  getCommand as getFpsCommand,
  processOutput as processFpsOutput,
} from "./gfxInfo/pollFpsUsage";
import { execLoopCommands } from "./shellNext";

const TIME_INTERVAL_S = 0.5;

export const pollPerformanceMeasures = (
  pid: string,
  dataCallback: (data: Measure) => void
) => {
  let initialTime: number | null = null;
  let previousTime: number | null = null;

  const cpuMeasuresAggregator = new CpuMeasureAggregator();

  return execLoopCommands(
    [
      {
        id: "START_TIME",
        command: "date +%s%3N",
      },
      {
        id: "CPU_STATS",
        command: getCpuCommand(pid),
      },
      { id: "RAM", command: getRamCommand(pid) },
      { id: "FPS", command: getFpsCommand(pid) },
      {
        id: "END_TIME",
        command: "date +%s%3N",
      },
    ],
    TIME_INTERVAL_S,
    ({ CPU_STATS, RAM, FPS, START_TIME, END_TIME }) => {
      const subProcessesStats = processOutput(CPU_STATS);
      const adbStartTime = parseInt(START_TIME, 10);
      const time = adbStartTime;

      const ram = processRamOutput(RAM);
      const fps = processFpsOutput(FPS);

      if (initialTime) {
        const adbEndTime = parseInt(END_TIME, 10);

        Logger.debug(
          `Measure received ${adbStartTime - initialTime}/${
            adbEndTime - initialTime
          }/ADB Exec time:${adbEndTime - adbStartTime}ms`
        );
      } else {
        initialTime = time;
      }

      if (previousTime) {
        const interval = time - previousTime;

        const cpuMeasures = cpuMeasuresAggregator.process(
          subProcessesStats,
          interval
        );
        dataCallback({ cpu: cpuMeasures, fps, ram, time: time - initialTime });
      } else {
        cpuMeasuresAggregator.initStats(subProcessesStats);
      }
      previousTime = time;
    }
  );
};
