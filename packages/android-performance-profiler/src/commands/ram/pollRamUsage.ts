import { Logger } from "@perf-profiler/logger";

export const processOutput = (result: string) => {
  const regexMatch = result.match(/TOTAL( )+(\d+)/);

  if (!regexMatch) {
    Logger.error(
      `Defaulting to 0MB RAM since output of meminfo couldn't be parsed: ${result}`
    );
    return 0;
  }

  return parseInt(regexMatch[2]) / 1000;
};
