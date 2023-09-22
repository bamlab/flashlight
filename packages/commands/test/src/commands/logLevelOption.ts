import { LogLevel, Logger } from "@perf-profiler/logger";
import { Option } from "commander";

export const logLevelOption = new Option("--logLevel <logLevel>", "Set Log level").choices(
  Object.keys(LogLevel).map((key) => key.toLocaleLowerCase())
);

export const applyLogLevelOption = (level?: string) => {
  if (level) {
    Logger.setLogLevel(LogLevel[level.toLocaleUpperCase() as keyof typeof LogLevel]);
  }
};
