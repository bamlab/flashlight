import React from "react";
import { AveragedTestCaseResult, Measure } from "@perf-profiler/types";
import { getAverageCpuUsage } from "@perf-profiler/reporter";
import { Chart, PALETTE } from "../components/Chart";
import { ComparativeThreadTable, ThreadTable } from "../components/ThreadTable";
import { roundToDecimal } from "../../utils/roundToDecimal";
import { Collapsible } from "../components/Collapsible";

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
  results,
}: {
  results: AveragedTestCaseResult[];
}) => {
  const reactNativeDetected = results.every(
    (result) => result.reactNativeDetected
  );
  const [selectedThreads, setSelectedThreads] = React.useState<string[]>(
    reactNativeDetected ? ["(mqt_js)"] : ["UI Thread"]
  );

  const threads = selectedThreads
    .map((threadName) =>
      results.map((result) => ({
        name: `${threadName}${results.length > 1 ? ` (${result.name})` : ""}`,
        data: buildCpuPerThreadSeriesData(result.average.measures, threadName),
      }))
    )
    .flat();

  const totalCPUUsage = results.map((result) => ({
    name: result.name,
    data: buildAverageCpuSeriesData(result.average.measures),
  }));

  return (
    <>
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
        colors={
          results.length > 1 ? PALETTE.slice(0, results.length) : undefined
        }
        maxValue={100}
      />
      <Collapsible
        unmountOnExit
        header={<div className="text-neutral-200 text-xl">{"Threads"}</div>}
        className="border rounded-lg border-gray-800 py-4 px-4"
      >
        {results.length > 1 ? (
          <ComparativeThreadTable
            results={results}
            selectedThreads={selectedThreads}
            setSelectedThreads={setSelectedThreads}
          />
        ) : (
          <ThreadTable
            measures={results[0].average.measures}
            selectedThreads={selectedThreads}
            setSelectedThreads={setSelectedThreads}
          />
        )}
      </Collapsible>
    </>
  );
};
