import React from "react";
import { AveragedTestCaseResult, TestCaseResult } from "@perf-profiler/types";
import {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
} from "@perf-profiler/reporter";
import { sanitizeProcessName } from "./utils/sanitizeProcessName";
import { roundToDecimal } from "./utils/roundToDecimal";
import { SimpleTable } from "./components/SimpleTable";
import { Score } from "./components/Score";
import { orderBy } from "lodash";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import { exportRawDataToJSON } from "./utils/reportRawDataExport";

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
    <div style={{ overflowY: "scroll", maxHeight: 100 }}>
      {processNames.length > 0 ? (
        <>
          <div style={{ color: "red" }}>Total: {total / 1000}s</div>
          <div>
            {orderBy(
              processNames,
              (processName) => highCpuProcesses[processName],
              "desc"
            ).map((processName) => (
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
    </div>
  );
};

export const ReportSummary = ({
  results,
  averagedResults,
}: {
  results: TestCaseResult[];
  averagedResults: AveragedTestCaseResult[];
}) => {
  const table = [
    [
      "",
      ...averagedResults.map((result) => (
        <Tooltip title="Save as JSON">
          <Button
            size="small"
            variant="text"
            startIcon={<FileDownloadIcon />}
            onClick={() => {
              exportRawDataToJSON(result.name, result);
            }}
          >
            {result.name}
          </Button>
        </Tooltip>
      )),
    ],
    ["Score", ...averagedResults.map((result) => <Score result={result} />)],
    [
      "Average Test Runtime",
      ...averagedResults.map(
        (result) => `${roundToDecimal(result.average.time, 0)}ms`
      ),
    ],
    [
      "Average FPS",
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageFPSUsage(result.average.measures), 1)}`
      ),
    ],
    [
      "Average CPU usage",
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageCpuUsage(result.average.measures), 1)}%`
      ),
    ],
    [
      "Average RAM usage",
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageRAMUsage(result.average.measures), 1)}MB`
      ),
    ],
    [
      "Processes with high CPU usage detected",
      ...averagedResults.map((result) => (
        <HighCpuProcesses highCpuProcesses={result.averageHighCpuUsage} />
      )),
    ],
  ];

  return (
    <>
      <SimpleTable rows={table} />
    </>
  );
};
