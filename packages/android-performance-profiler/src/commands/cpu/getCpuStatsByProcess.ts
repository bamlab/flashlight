import { ThreadNames } from "@perf-profiler/types";

export interface ProcessStat {
  processId: string;
  processName: string;
  totalCpuTime: number;
  cpuNumber: string;
}

export const processOutput = (output: string, pid: string): ProcessStat[] =>
  output
    .split(/\r\n|\n|\r/)
    .filter(Boolean)
    .map((stats) => {
      const match = stats.match(/^(\d+) \(([^)]+)\) (.*)/);
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

      const utime = parseInt(subProcessStats[13], 10);
      const stime = parseInt(subProcessStats[14], 10);

      const cpuNumber = subProcessStats[38];

      const totalCpuTime = utime + stime;

      return { processId, processName, totalCpuTime, cpuNumber };
    });
