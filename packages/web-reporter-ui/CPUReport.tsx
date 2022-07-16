import React from "react";
import { Measure, TestCaseIterationResult } from "@performance-profiler/types";
import { getAverageCpuUsage } from "@performance-profiler/reporter";
import { Chart } from "./components/Chart";
import { ThreadTable } from "./components/ThreadTable";
import { useTheme } from "@mui/material/styles";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import { roundToDecimal } from "./utils/roundToDecimal";

const buildSeriesData = (
  measures: Measure[],
  calculate: (measure: Measure) => number
) =>
  measures
    .map((measure) => calculate(measure) || 0)
    .map((value, i) => ({
      x: i * 500,
      y: roundToDecimal(value, 1),
    }));

const buildAverageCpuSeriesData = (measures: Measure[]) =>
  buildSeriesData(measures, (measure) => getAverageCpuUsage([measure]));

const buildCpuPerThreadSeriesData = (measures: Measure[], threadName: string) =>
  buildSeriesData(measures, (measure) => measure.cpu.perName[threadName]);

export const CPUReport = ({
  measures,
  iterations,
}: {
  measures: Measure[];
  iterations: TestCaseIterationResult[];
}) => {
  const reactNativeDetected = measures.some((measure) =>
    Object.keys(measure.cpu.perName).some((key) => key === "(mqt_js)")
  );
  const [selectedThreads, setSelectedThreads] = React.useState<string[]>(
    reactNativeDetected ? ["(mqt_js)"] : []
  );

  const threads = selectedThreads.map((threadName) => ({
    name: threadName,
    data: buildCpuPerThreadSeriesData(measures, threadName),
  }));

  const totalCPUUsage = [
    {
      name: "Total CPU Usage (%)",
      data: buildAverageCpuSeriesData(measures),
    },
  ].concat(
    iterations.length <= 1
      ? []
      : iterations.map((iteration, index) => ({
          name: `Iteration ${index + 1}`,
          data: buildAverageCpuSeriesData(iteration.measures),
          color: "#0000ff10",
        }))
  );

  const { palette } = useTheme();

  return (
    <>
      <Chart
        title="Total CPU Usage (%)"
        height={500}
        interval={500}
        series={totalCPUUsage}
        colors={[palette.primary.main]}
      />
      <Chart
        title="CPU Usage per thread (%)"
        height={500}
        interval={500}
        series={threads}
        maxValue={100}
      />
      <Accordion>
        <AccordionSectionTitle title="Threads"></AccordionSectionTitle>
        <AccordionDetails>
          <ThreadTable
            measures={measures}
            selectedThreads={selectedThreads}
            setSelectedThreads={setSelectedThreads}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
