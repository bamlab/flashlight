import { Measure } from "../Measure";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import { getCommand, processOutput } from "./cpu/getCpuStatsByProcess";
import { executeCommand } from "./shell";

const TIME_INTERVAL_S = 0.5;
export const pollCpuPerCoreUsage = (
  pidId: string,
  dataCallback: (data: Measure) => void
) => {
  let isFirstMeasure = true;

  const cpuMeasuresAggregator = new CpuMeasureAggregator(TIME_INTERVAL_S);

  /**
   * TODO: using setInterval is probably a bad idea.
   * Should double check that the timings are accurate, otherwise
   * fallback to execute a loop in the device shell and ensure we can handle chunks of data
   **/
  const interval = setInterval(() => {
    const subProcessesStats = processOutput(
      executeCommand(`adb shell "${getCommand(pidId)}"`)
    );

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
