import React from "react";
import { Measure, TestCaseIterationResult } from "@performance-profiler/types";
import {
  averageHighCpuUsage,
  getAverageCpuUsage,
  getAverageRAMUsage,
} from "@performance-profiler/reporter";
import { sanitizeProcessName } from "./utils/sanitizeProcessName";
import { roundToDecimal } from "./utils/roundToDecimal";

const HighCpuProcesses = ({
  iterations,
}: {
  iterations: TestCaseIterationResult[];
}) => {
  const highCpuProcesses = averageHighCpuUsage(iterations, 90);
  const processNames = Object.keys(highCpuProcesses);

  return (
    <>
      <b>Processes with high CPU usage detected: </b>
      {processNames.length > 0 ? (
        <ul style={{ color: "red" }}>
          {processNames.map((processName) => (
            <li key={processName}>
              {sanitizeProcessName(processName)} for{" "}
              {highCpuProcesses[processName] / 1000}s
            </li>
          ))}
        </ul>
      ) : (
        <span style={{ color: "green" }}>None</span>
      )}
    </>
  );
};

export const ReportSummary = ({
  measures,
  iterations,
}: {
  measures: Measure[];
  iterations: TestCaseIterationResult[];
}) => {
  const reactNativeDetected = measures.some((measure) =>
    Object.keys(measure.cpu.perName).some((key) => key === "(mqt_js)")
  );

  return (
    <>
      <div style={{ padding: 10 }}>
        <b>Average CPU Usage: </b>
        {roundToDecimal(getAverageCpuUsage(measures), 1)}%
        <br />
        <b>Average RAM Usage: </b>
        {roundToDecimal(getAverageRAMUsage(measures), 1)}MB
        <br />
        <HighCpuProcesses iterations={iterations} />
        {reactNativeDetected ? (
          <div>
            <img
              alt="React Native logo"
              style={{ height: 20, width: 20 }}
              src="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg"
            />{" "}
            React Native was detected.
          </div>
        ) : null}
      </div>
    </>
  );
};
