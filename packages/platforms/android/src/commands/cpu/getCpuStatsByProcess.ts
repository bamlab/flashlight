import { ThreadNames } from "@perf-profiler/types";

export interface ProcessStat {
  processId: string;
  processName: string;
  totalCpuTime: number;
  cpuNumber: string;
}

export const processOutput = (output: string, pid: string): ProcessStat[] => {
  /**
   * We can have multiple processes with the same name but a different pid
   *
   * Say your app dispatches multiple "OkHttp Dispatch" processes to make several requests at the same time
   *
   * We'll display:
   *  - OkHttp Dispatch: xx%
   *  - OkHttp Dispatch (2): xx%
   *  - OkHttp Dispatch (3): xx%
   *  ...
   */
  const processNameCount: { [name: string]: number } = {};

  return output
    .split(/\r\n|\n|\r/)
    .filter(Boolean)
    .map((stats) => {
      const match = stats.match(/^(\d+) \((.*)\) (.*)/);
      if (!match) {
        throw new Error(`Invalid line: ${stats}`);
      }

      const [, processId, processName, remaining] = match;
      const parts = remaining.split(" ");

      return [processId, processName, ...parts];
    })
    .filter(Boolean)
    .map((subProcessStats) => {
      const processId = subProcessStats[0];
      let processName = processId === pid ? ThreadNames.UI_THREAD : subProcessStats[1];

      if (processName.includes(`Binder:${pid}_`)) {
        processName = processName.replace(`Binder:${pid}_`, "Binder #");
      }

      if (processName === "") {
        processName = "Empty name";
      }

      processNameCount[processName] = (processNameCount[processName] || 0) + 1;

      if (processNameCount[processName] > 1) {
        processName = `${processName} (${processNameCount[processName]})`;
      }

      const utime = parseInt(subProcessStats[13], 10);
      const stime = parseInt(subProcessStats[14], 10);

      const cpuNumber = subProcessStats[38];

      const totalCpuTime = utime + stime;

      return { processId, processName, totalCpuTime, cpuNumber };
    });
};
