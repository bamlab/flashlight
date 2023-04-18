import { Tooltip, Button } from "@mui/material";
import {
  sanitizeProcessName,
  getAverageFPSUsage,
  getAverageCpuUsage,
  getAverageRAMUsage,
} from "@perf-profiler/reporter";
import { TestCaseResult, AveragedTestCaseResult } from "@perf-profiler/types";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { orderBy } from "lodash";
import React from "react";
import { exportRawDataToJSON } from "../../../utils/reportRawDataExport";
import { roundToDecimal } from "../../../utils/roundToDecimal";
import { MetricWithExplanation } from "../../components/ReportSummary/MetricWithExplanation";
import { Score } from "../../components/Score";
import { SimpleTable } from "../../components/SimpleTable";

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
          <div style={{ color: "red" }}>
            Total: {roundToDecimal(total / 1000, 1)}s
          </div>
          <div>
            {orderBy(
              processNames,
              (processName) => highCpuProcesses[processName],
              "desc"
            ).map((processName) => (
              <div key={processName}>
                {sanitizeProcessName(processName)} for{" "}
                {roundToDecimal(highCpuProcesses[processName] / 1000, 1)}s
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

export const OldReportSummary = ({
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
      <MetricWithExplanation
        title="Average Test Runtime"
        explanation={
          <>
            Time taken to run the test.
            <br />
            Can be helpful to measure Time To Interactive of your app, if the
            test is checking app start for instance.
          </>
        }
      />,
      ...averagedResults.map(
        (result) => `${roundToDecimal(result.average.time, 0)}ms`
      ),
    ],
    [
      <MetricWithExplanation
        title="Average FPS"
        explanation={
          <>
            Frame Per Second. Your app should display 60 Frames Per Second to
            give an impression of fluidity. This number should be close to 60,
            otherwise it will seem laggy. <br />
            See{" "}
            <a
              href="https://www.youtube.com/watch?v=CaMTIgxCSqU"
              target="_blank"
              rel="noreferrer"
            >
              this video
            </a>{" "}
            for more details
          </>
        }
      />,
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageFPSUsage(result.average.measures), 1)}`
      ),
    ],
    [
      <MetricWithExplanation
        title="Average CPU usage"
        explanation={
          <>
            An app might run at 60FPS but might be using too much processing
            power, so it's important to check CPU usage.
            <br /> Depending on the device, this value can go up to{" "}
            <code>100% x number of cores</code>. For instance, a Samsung A10s
            has 4 cores, so the max value would be 400%.
          </>
        }
      />,
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageCpuUsage(result.average.measures), 1)}%`
      ),
    ],
    [
      <MetricWithExplanation
        title="Processes with high CPU usage detected"
        explanation={
          <>
            Your app might have low CPU usage overall but if one process is
            saturating a CPU core (using close to 100% CPU), you’re likely to
            experience unresponsiveness, for instance the app not responding to
            touch events.
            <br />
            One example of this is the JS thread being overworked in a React
            Native app, the app will become completely unresponsive even though
            FPS could still be 60.
          </>
        }
      />,
      ...averagedResults.map((result) => (
        <HighCpuProcesses highCpuProcesses={result.averageHighCpuUsage} />
      )),
    ],
    [
      <MetricWithExplanation
        title="Average RAM usage"
        explanation={
          <>
            If an app consumes a large amount of RAM (random-access memory), it
            can impact the overall performance of the device and drain the
            battery more quickly.
            <br />
            It’s worth noting that results might be higher than expected since
            we measure RSS and not PSS (See{" "}
            <a
              href="https://github.com/bamlab/android-performance-profiler/issues/11#issuecomment-1219317891"
              target="_blank"
              rel="noreferrer"
            >
              here for more details
            </a>
            )
          </>
        }
      />,
      ...averagedResults.map(
        (result) =>
          `${roundToDecimal(getAverageRAMUsage(result.average.measures), 1)}MB`
      ),
    ],
  ];

  return <SimpleTable rows={table} />;
};
