import React, { ComponentProps } from "react";
import { DevicePluginClient, createState } from "flipper-plugin";
import {
  getAverageCpuUsage,
  getHighCpuUsageStats,
  Measure,
} from "android-performance-profiler";
import { Chart } from "./components/Chart";
import { ScrollContainer } from "./components/ScrollContainer";
import { ThreadTable } from "./components/ThreadTable";
import { sanitizeProcessName } from "./utils/sanitizeProcessName";
import { Typography } from "@mui/material";

const roundToDecimal = (value: number, decimalCount: number) => {
  const factor = Math.pow(10, decimalCount);
  return Math.floor(value * factor) / factor;
};

// We don't actually use the device plugin functionalities
export function devicePlugin(client: DevicePluginClient) {
  const data = createState<string[]>([]);

  return { data };
}

const SectionTitle = (props: ComponentProps<typeof Typography>) => (
  <Typography
    variant="h4"
    {...props}
    style={{ color: "#666666", margin: 10 }}
  ></Typography>
);

const HighCpuProcesses = ({ measures }: { measures: Measure[] }) => {
  const highCpuProcesses = getHighCpuUsageStats(measures, 90);
  const processNames = Object.keys(highCpuProcesses);

  return (
    <>
      <b>Processes with high CPU usage detected: </b>
      {processNames.length > 0 ? (
        <ul style={{ color: "red" }}>
          {processNames.map((processName) => (
            <li key={processName}>
              {sanitizeProcessName(processName)} for{" "}
              {highCpuProcesses[processName].length * 0.5}s
            </li>
          ))}
        </ul>
      ) : (
        <span style={{ color: "green" }}>None</span>
      )}
    </>
  );
};

const Report = ({ measures }: { measures: Measure[] }) => {
  const reactNativeDetected = measures.some((measure) =>
    Object.keys(measure.cpu.perName).some((key) => key === "(mqt_js)")
  );
  const [selectedThreads, setSelectedThreads] = React.useState<string[]>(
    reactNativeDetected ? ["(mqt_js)"] : []
  );

  const threads = selectedThreads.map((threadName) => ({
    name: threadName,
    data: measures
      .map((measure) => measure.cpu.perName[threadName] || 0)
      .map((value, i) => ({
        x: i * 500,
        y: value,
      })),
  }));

  const totalCPUUsage = [
    {
      name: "Total CPU Usage (%)",
      data: measures
        .map((measure) => getAverageCpuUsage([measure]) || 0)
        .map((value, i) => ({
          x: i * 500,
          y: value,
        })),
    },
  ];

  return (
    <>
      <div style={{ padding: 10 }}>
        <b>Average CPU Usage (%): </b>
        {roundToDecimal(getAverageCpuUsage(measures), 1)}
        <br />
        <HighCpuProcesses measures={measures} />
        {reactNativeDetected ? (
          <div>
            <img
              style={{ height: 20, width: 20 }}
              src="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg"
            />{" "}
            React Native was detected.
          </div>
        ) : null}
      </div>
      <Chart
        title="Total CPU Usage (%)"
        height={500}
        interval={500}
        series={totalCPUUsage}
      />
      <Chart
        title="CPU Usage per thread (%)"
        height={500}
        interval={500}
        series={threads}
        maxValue={100}
      />
      <SectionTitle>Threads</SectionTitle>
      <ThreadTable
        measures={measures}
        selectedThreads={selectedThreads}
        setSelectedThreads={setSelectedThreads}
      />
    </>
  );
};

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <ScrollContainer>
    {measures.length > 1 ? <Report measures={measures} /> : null}
  </ScrollContainer>
);
