import { Logger } from "@perf-profiler/logger";
import { ChildProcess } from "child_process";
import { getAbi } from "./getAbi";
import {
  executeAsync,
  executeCommand,
  executeLongRunningProcess,
} from "./shell";

const CppProfilerName = `BAMPerfProfiler`;
const deviceProfilerPath = `/data/local/tmp/${CppProfilerName}`;

const binaryFolder = `${__dirname}/../..${
  __dirname.includes("dist") ? "/.." : ""
}/cpp-profiler/bin`;

let hasInstalledProfiler = false;
let aTraceProcess: ChildProcess | null = null;

const startATrace = () => {
  Logger.debug("Stopping atrace and flushing output...");
  executeCommand("adb shell atrace --async_stop 1>/dev/null");
  Logger.debug("Starting atrace...");
  aTraceProcess = executeAsync("adb shell atrace -c view -t 999");
};

const stopATrace = () => {
  aTraceProcess?.kill();
};

export const ensureCppProfilerIsInstalled = () => {
  if (!hasInstalledProfiler) {
    const abi = getAbi();
    Logger.info(`Installing C++ profiler for ${abi} architecture`);

    const binaryPath = `${binaryFolder}/${CppProfilerName}-${abi}`;

    const command = `adb push ${binaryPath} ${deviceProfilerPath}`;
    executeCommand(command);
    Logger.success(`C++ Profiler installed in ${deviceProfilerPath}`);
  }
  if (!aTraceProcess) startATrace();
  hasInstalledProfiler = true;
};

export const getCpuClockTick = () => {
  ensureCppProfilerIsInstalled();
  return parseInt(
    executeCommand(`adb shell ${deviceProfilerPath} printCpuClockTick`),
    10
  );
};

export const getRAMPageSize = () => {
  ensureCppProfilerIsInstalled();
  return parseInt(
    executeCommand(`adb shell ${deviceProfilerPath} printRAMPageSize`),
    10
  );
};

type CppPerformanceMeasure = {
  cpu: string;
  ram: string;
  atrace: string;
  timestamp: number;
  adbExecTime: number;
};

export const parseCppMeasure = (measure: string): CppPerformanceMeasure => {
  const DELIMITER = "=SEPARATOR=";
  const START_MEASURE_DELIMITER = "=START MEASURE=";

  const [cpu, ram, atrace, timings] = measure
    .replace(START_MEASURE_DELIMITER, "")
    .split(DELIMITER)
    .map((s) => s.trim());

  const [timestamp, adbExecTime] = timings
    .split("\n")
    .map((line) => parseInt(line.split(": ")[1], 10));

  return { cpu, ram, atrace, timestamp, adbExecTime };
};

export const pollPerformanceMeasures = (
  pid: string,
  onData: (measure: CppPerformanceMeasure) => void
) => {
  ensureCppProfilerIsInstalled();

  const DELIMITER = "=STOP MEASURE=";

  const process = executeLongRunningProcess(
    `adb shell ${deviceProfilerPath} pollPerformanceMeasures ${pid}`,
    DELIMITER,
    (data: string) => {
      onData(parseCppMeasure(data));
    }
  );

  return {
    stop: () => {
      process.stop();
      // We need to close this process, otherwise tests will hang
      Logger.debug("Stopping atrace process...");
      stopATrace();
    },
  };
};
