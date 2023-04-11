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
    .map((stats) => stats.split(" "))
    .filter(Boolean)
    .map((subProcessStats) => {
      const processId = subProcessStats[0];
      const processName = processId === pid ? "UI Thread" : subProcessStats[1];
      const utime = parseInt(subProcessStats[13], 10);
      const stime = parseInt(subProcessStats[14], 10);
      const cutime = parseInt(subProcessStats[15], 10);
      const cstime = parseInt(subProcessStats[16], 10);
      const cpuNumber = subProcessStats[38];

      const totalCpuTime = utime + stime + cutime + cstime;

      return { processId, processName, totalCpuTime, cpuNumber };
    });
