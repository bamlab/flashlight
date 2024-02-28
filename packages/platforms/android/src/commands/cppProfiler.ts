import { Logger } from "@perf-profiler/logger";
import { canIgnoreAwsTerminationError, executeLongRunningProcess } from "./shell";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { profiler } from "./platforms/platformProfiler";

/**
 * Main setup function for the cpp profiler
 *
 * It will:
 * - install the C++ profiler for the correct architecture on the device
 * - Starts the atrace process (the c++ profiler will then starts another thread to read from it)
 * - Populate needed values like CPU clock tick and RAM page size
 *
 * This needs to be done before measures and can take a few seconds
 */
export const ensureCppProfilerIsInstalled = () => {
  profiler.ensureCppProfilerIsInstalled();
};

export const getCpuClockTick = () => {
  return profiler.getCpuClockTick();
};

export const getRAMPageSize = () => {
  return profiler.getRAMPageSize();
};

type CppPerformanceMeasure = {
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

export const pollPerformanceMeasures = (
  pid: string,
  onData: (measure: CppPerformanceMeasure) => void,
  onPidChanged?: (pid: string) => void
) => {
  ensureCppProfilerIsInstalled();

  const DELIMITER = "=STOP MEASURE=";

  const process = executeLongRunningProcess(
    profiler.getDeviceCommand(
      `${profiler.getDeviceProfilerPath()} pollPerformanceMeasures ${pid} ${POLLING_INTERVAL}`
    ),
    DELIMITER,
    (data: string) => {
      onData(parseCppMeasure(data));
    }
  );

  process.stderr?.on("data", (data) => {
    const log = data.toString();

    // Ignore errors, it might be that the thread is dead and we can't read stats anymore
    if (log.includes("CPP_ERROR_CANNOT_OPEN_FILE")) {
      Logger.debug(log);
    } else if (log.includes("CPP_ERROR_MAIN_PID_CLOSED")) {
      onPidChanged?.(pid);
    } else {
      if (!canIgnoreAwsTerminationError(log)) Logger.error(log);
    }
  });

  return {
    stop: () => {
      process.kill("SIGINT");
      profiler.stop();
    },
  };
};
