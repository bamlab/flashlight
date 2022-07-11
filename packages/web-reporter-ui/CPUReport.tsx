import React from "react";
import { Measure } from "@performance-profiler/types";
import { getAverageCpuUsage } from "@performance-profiler/reporter";
import { Chart } from "./components/Chart";
import { ThreadTable } from "./components/ThreadTable";
import { useTheme } from "@mui/material/styles";
import { AccordionSectionTitle } from "./components/AccordionSectionTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";

export const CPUReport = ({ measures }: { measures: Measure[] }) => {
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
