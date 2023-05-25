import { Logger } from "@perf-profiler/logger";

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
    .filter((line) => {
      // Ignore errors, it might be that the thread is dead and we can read stats anymore
      if (line.includes("C++ Error")) {
        Logger.debug(line);
        return false;
      }
      return true;
    })
    .map((stats) => stats.split(" "))
    .filter(Boolean)
    .map((subProcessStats) => {
      const processId = subProcessStats[0];
      let processName = processId === pid ? "UI Thread" : subProcessStats[1];

      if (processName.includes(`Binder:${pid}_`)) {
        processName = processName.replace(`Binder:${pid}_`, "Binder #");
      }

      const utime = parseInt(subProcessStats[13], 10);
      const stime = parseInt(subProcessStats[14], 10);

      const cpuNumber = subProcessStats[38];

      const totalCpuTime = utime + stime;

      return { processId, processName, totalCpuTime, cpuNumber };
    });
