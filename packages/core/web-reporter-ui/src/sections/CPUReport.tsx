import React from "react";
import {
  AveragedTestCaseResult,
  Measure,
  POLLING_INTERVAL,
  ThreadNames,
  ThreadNamesIOS,
} from "@perf-profiler/types";
import { ComparativeThreadTable, ThreadTable } from "../components/ThreadTable";
import { Collapsible } from "../components/Collapsible";
import { getColorPalette } from "../theme/colors";
import { getAverageCpuUsage, roundToDecimal } from "@perf-profiler/reporter";
import { ReportChart } from "../components/Charts/ReportChart";

const buildSeriesData = (measures: Measure[], calculate: (measure: Measure) => number) =>
  measures
    .map((measure) => calculate(measure) || 0)
    .map((value, i) => ({
      x: i * POLLING_INTERVAL,
      y: roundToDecimal(value, 1),
    }));

const buildAverageCpuSeriesData = (measures: Measure[]) =>
  buildSeriesData(measures, (measure) => getAverageCpuUsage([measure]));

const buildCpuPerThreadSeriesData = (measures: Measure[], threadName: string) =>
  buildSeriesData(measures, (measure) => measure.cpu.perName[threadName]);

const totalCpuAnnotationInterval = [{ y: 300, y2: 1000, color: "#E62E2E", label: "Danger Zone" }];

const perThreadCpuAnnotationInterval = [{ y: 90, y2: 100, color: "#E62E2E", label: "Danger Zone" }];

const autoSelectedThreads = [
  ThreadNamesIOS.JS_THREAD,
  ThreadNames.JS_THREAD,
  ThreadNames.UI_THREAD,
  ThreadNamesIOS.UI_THREAD,
  // TODO: add more threads
];

const getAutoSelectedThreads = (results: AveragedTestCaseResult[]) => {
  const autoSelectedThread = autoSelectedThreads.find((threadName) =>
    results
      .filter((result) => result.average.measures.length > 0)
      .every((result) => {
        const lastMeasure = result.average.measures[result.average.measures.length - 1];
        return (
          lastMeasure.cpu.perName[threadName] !== undefined ||
          // Support legacy json files with thread names in parenthesis
          lastMeasure.cpu.perName[`(${threadName})`] !== undefined
        );
      })
  );

  return autoSelectedThread ? [autoSelectedThread] : [];
};

export const CPUReport = ({ results }: { results: AveragedTestCaseResult[] }) => {
  const [selectedThreads, setSelectedThreads] = React.useState<string[]>(
    getAutoSelectedThreads(results)
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
      <ReportChart
        title="Total CPU Usage (%)"
        height={500}
        series={totalCPUUsage}
        annotationIntervalList={totalCpuAnnotationInterval}
      />
      <ReportChart
        title="CPU Usage per thread (%)"
        height={500}
        series={threads}
        colors={results.length > 1 ? getColorPalette().slice(0, results.length) : undefined}
        maxValue={100}
        showLegendForSingleSeries
        annotationIntervalList={perThreadCpuAnnotationInterval}
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
