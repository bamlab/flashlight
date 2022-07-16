import chalk from "chalk";
import { performance } from "perf_hooks";

const info = chalk.blue;
const success = chalk.bold.green;
const warn = chalk.hex("#FFA500");

export enum LogLevel {
  WARN,
  SUCCESS,
  INFO,
  DEBUG,
}

let logLevel = LogLevel.INFO;

export const Logger = {
  setLogLevel: (level: LogLevel) => {
    logLevel = level;
  },
  debug: (message: string) => {
    if (logLevel < LogLevel.DEBUG) return;

    const time = performance.now();
    console.log(`🚧  ${Math.floor(time)}: ${message}`);
  },
  info: (message: string) => {
    if (logLevel < LogLevel.INFO) return;

    console.log(info(`ℹ️  ${message}`));
  },
  success: (message: string) => {
    if (logLevel < LogLevel.SUCCESS) return;

    console.log(success(`✅  ${message}`));
  },
  warn: (message: string) => {
    if (logLevel < LogLevel.WARN) return;

    console.log(warn(`⚠️  ${message}`));
  },
};
