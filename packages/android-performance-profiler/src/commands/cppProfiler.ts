import { Logger } from "@perf-profiler/logger";
import { getAbi } from "./getAbi";
import { executeCommand, executeLongRunningProcess } from "./shellNext";

const CppProfilerName = "BAMPerfProfiler";
const deviceProfilerPath = `/data/local/tmp/${CppProfilerName}`;

const binaryFolder = `${__dirname}/../..${
  __dirname.includes("dist") ? "/.." : ""
}/cpp-profiler/bin`;

export const installCppProfiler = () => {
  const abi = getAbi();
  Logger.info(`Installing C++ profiler for ${abi} architecture`);

  const binaryPath = `${binaryFolder}/${CppProfilerName}-${abi}`;

  const command = `adb push ${binaryPath} ${deviceProfilerPath}`;
  executeCommand(command);
  Logger.success(`C++ Profiler installed in ${deviceProfilerPath}`);
};

export const getCpuClockTick = () =>
  parseInt(
    executeCommand(`adb shell ${deviceProfilerPath} printCpuClockTick`),
    10
  );

export const getRAMPageSize = () =>
  parseInt(
    executeCommand(`adb shell ${deviceProfilerPath} printRAMPageSize`),
    10
  );

type CppPerformanceMeasure = {
  cpu: string;
  ram: string;
  gfxinfo: string;
  timestamp: number;
  adbExecTime: number;
};

export const parseCppMeasure = (measure: string): CppPerformanceMeasure => {
  const DELIMITER = "=SEPARATOR=";
  const START_MEASURE_DELIMITER = "=START MEASURE=";

  const [cpu, ram, gfxinfo, timings] = measure
    .replace(START_MEASURE_DELIMITER, "")
    .split(DELIMITER)
    .map((s) => s.trim());

  const [timestamp, adbExecTime] = timings
    .split("\n")
    .map((line) => parseInt(line.split(": ")[1], 10));

  return { cpu, ram, gfxinfo, timestamp, adbExecTime };
};

export const pollPerformanceMeasures = (
  pid: string,
  onData: (measure: CppPerformanceMeasure) => void
) => {
  installCppProfiler();

  const DELIMITER = "=STOP MEASURE=";

  const process = executeLongRunningProcess(
    `adb shell ${deviceProfilerPath} pollPerformanceMeasures ${pid}`,
    DELIMITER,
    (data: string) => {
      onData(parseCppMeasure(data));
    }
  );

  return process;
};
