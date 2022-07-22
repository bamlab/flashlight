import React from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
} from "@perf-profiler/reporter";
import { sanitizeProcessName } from "./utils/sanitizeProcessName";
import { roundToDecimal } from "./utils/roundToDecimal";
import { SimpleTable } from "./components/SimpleTable";
import { Score } from "./components/Score";

const HighCpuProcesses = ({
  highCpuProcesses,
}: {
  highCpuProcesses: { [processName: string]: number };
}) => {
  const processNames = Object.keys(highCpuProcesses);
  const total = processNames.reduce(
    (sum, name) => sum + highCpuProcesses[name],
    0
  );

  return (
    <>
      {processNames.length > 0 ? (
        <>
          <div style={{ color: "red" }}>Total: {total / 1000}s</div>
          <div>
            {processNames.map((processName) => (
              <div key={processName}>
                {sanitizeProcessName(processName)} for{" "}
                {highCpuProcesses[processName] / 1000}s
              </div>
            ))}
          </div>
        </>
      ) : (
        <span style={{ color: "green" }}>None ✅</span>
      )}
    </>
  );
};

const FrameworkDetection = ({
  reactNativeDetected,
}: {
  reactNativeDetected: boolean;
}) => {
  return reactNativeDetected ? (
    <div>
      <img
        alt="React Native logo"
        style={{ height: 20, width: 20 }}
        src="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg"
      />{" "}
      React Native detected
    </div>
  ) : null;
};

export const ReportSummary = ({
  results,
}: {
  results: AveragedTestCaseResult[];
}) => {
  const table = [
    ["", ...results.map((result) => result.name)],
    ["Score", ...results.map((result) => <Score result={result} />)],
    [
      "Average Test Runtime",
      ...results.map((result) => `${roundToDecimal(result.average.time, 0)}ms`),
    ],
    [
      "Average FPS usage",
      ...results.map(
        (result) =>
          `${roundToDecimal(getAverageFPSUsage(result.average.measures), 1)}`
      ),
    ],
    [
      "Average CPU usage",
      ...results.map(
        (result) =>
          `${roundToDecimal(getAverageCpuUsage(result.average.measures), 1)}%`
      ),
    ],
    [
      "Average RAM usage",
      ...results.map(
        (result) =>
          `${roundToDecimal(getAverageRAMUsage(result.average.measures), 1)}MB`
      ),
    ],
    [
      "Processes with high CPU usage detected",
      ...results.map((result) => (
        <HighCpuProcesses highCpuProcesses={result.averageHighCpuUsage} />
      )),
    ],
    [
      "React Native?",
      ...results.map((result) => (
        <FrameworkDetection reactNativeDetected={result.reactNativeDetected} />
      )),
    ],
  ];

  return (
    <>
      <SimpleTable rows={table} />
    </>
  );
};
