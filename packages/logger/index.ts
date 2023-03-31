import kleur from "kleur";
import { DateTime } from "luxon";

const info = kleur.blue;
const success = kleur.bold().green;
const warn = kleur.bold().yellow().bgRed;
const error = kleur.bold().red;
const timestampColor = kleur.grey;

export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  SUCCESS: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5,
};

let logLevel = LogLevel.INFO;

const log = (message: string) => {
  const timestamp = DateTime.now().toLocaleString(
    DateTime.TIME_24_WITH_SECONDS
  );
  const timestampLog = timestampColor(`[${timestamp}]`);
  console.log(`${timestampLog} ${message}`);
};

type ValueOf<T> = T[keyof T];

export const Logger = {
  setLogLevel: (level: ValueOf<typeof LogLevel>) => {
    logLevel = level;
  },
  debug: (message: string) => {
    if (logLevel < LogLevel.DEBUG) return;

    const time = performance.now();
    log(`🚧  ${Math.floor(time)}: ${message}`);
  },
  info: (message: string) => {
    if (logLevel < LogLevel.INFO) return;

    log(info(`ℹ️  ${message}`));
  },
  success: (message: string) => {
    if (logLevel < LogLevel.SUCCESS) return;

    log(success(`✅  ${message}`));
  },
  warn: (message: string) => {
    if (logLevel < LogLevel.WARN) return;

    log(warn(`⚠️  ${message}`));
  },
  error: (message: string) => {
    if (logLevel < LogLevel.ERROR) return;

    log(error(`🚨  ${message}`));
  },
};

export const printExampleMessages = () => {
  Logger.setLogLevel(Infinity);
  Object.keys(Logger).forEach((key: string) => {
    if (key === "setLogLevel") return;

    (Logger[key as keyof typeof Logger] as typeof Logger.debug)(
      `This is an awesome ${key} message`
    );
  });
};
