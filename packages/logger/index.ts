import kleur from "kleur";

const info = kleur.blue;
const success = kleur.bold().green;
const warn = kleur.bold().yellow().bgRed;
const error = kleur.bold().red;

export enum LogLevel {
  ERROR,
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
  error: (message: string) => {
    if (logLevel < LogLevel.ERROR) return;

    console.log(error(`🚨  ${message}`));
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
