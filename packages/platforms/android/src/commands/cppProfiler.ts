import { Logger } from "@perf-profiler/logger";

export type CppPerformanceMeasure = {
  pid: string;
  cpu: string;
  ram: string;
  atrace: string;
  timestamp: number;
};

export const parseCppMeasure = (measure: string): CppPerformanceMeasure => {
  Logger.trace(measure);

  const DELIMITER = "=SEPARATOR=";
  const START_MEASURE_DELIMITER = "=START MEASURE=";

  const measureSplit = measure.split(START_MEASURE_DELIMITER);
  const measureContent = measureSplit[measureSplit.length - 1];

  const [pid, cpu, ram, atrace, timings] = measureContent.split(DELIMITER).map((s) => s.trim());

  const [timestampLine, execTimings] = timings.split(/\r\n|\n|\r/);

  const timestamp = parseInt(timestampLine.split(": ")[1], 10);

  Logger.debug(`C++ Exec timings:${execTimings}ms`);

  return { pid, cpu, ram, atrace, timestamp };
};
