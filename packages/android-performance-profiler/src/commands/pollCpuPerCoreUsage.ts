import { Measure } from "../Measure";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import {
  getCommand as getCpuCommand,
  processOutput,
} from "./cpu/getCpuStatsByProcess";
import { execLoopCommands } from "./shellNext";

const TIME_INTERVAL_S = 0.5;
export const pollCpuPerCoreUsage = (
  pidId: string,
  dataCallback: (data: Measure) => void
) => {
  let isFirstMeasure = true;

  const cpuMeasuresAggregator = new CpuMeasureAggregator(TIME_INTERVAL_S);

  return execLoopCommands(
    [
      {
        id: "CPU_STATS",
        command: getCpuCommand(pidId),
      },
    ],
    TIME_INTERVAL_S,
    ({ CPU_STATS }) => {
      const subProcessesStats = processOutput(CPU_STATS);

      const cpuMeasures = cpuMeasuresAggregator.process(subProcessesStats);

      if (!isFirstMeasure) {
        dataCallback(cpuMeasures);
      }
      isFirstMeasure = false;
    }
  );
};
