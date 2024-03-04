import React from "react";
import { AveragedTestCaseResult, Measure, POLLING_INTERVAL } from "@perf-profiler/types";
import { ComparativeThreadTable, ThreadTable } from "../components/ThreadTable";
import { Collapsible } from "../components/Collapsible";
import { getColorPalette } from "../theme/colors";
import { getAverageCpuUsage, roundToDecimal } from "@perf-profiler/reporter";
import { ReportChart } from "../components/Charts/ReportChart";
import { THREAD_ICON_MAPPING, getAutoSelectedThreads } from "./threads";

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

export const getNumberOfThreads = (results: AveragedTestCaseResult[]) => {
  if (results.length === 0 || results[0].average.measures.length === 0) {
    return 0;
  }
  const lastMeasure = results[0].average.measures[results[0].average.measures.length - 1];
  return Object.keys(lastMeasure.cpu.perName).length;
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

  const TitleIcon = THREAD_ICON_MAPPING[selectedThreads[0]];

  const chartTitle =
    selectedThreads.length === 1 ? (
      <div className="flex flex-row align-center">
        {TitleIcon ? (
          <div className="mr-3 flex items-center">
            <TitleIcon size={30} />
          </div>
        ) : null}
        {`${selectedThreads[0]} CPU Usage (%)`}
      </div>
    ) : (
      "CPU Usage per thread (%)"
    );

  return (
    <>
      <ReportChart
        title="Total CPU Usage (%)"
        height={500}
        series={totalCPUUsage}
        annotationIntervalList={totalCpuAnnotationInterval}
      />
      {getNumberOfThreads(results) > 1 && (
        <>
          <ReportChart
            title={chartTitle}
            height={500}
            series={threads}
            colors={results.length > 1 ? getColorPalette().slice(0, results.length) : undefined}
            maxValue={100}
            showLegendForSingleSeries
            annotationIntervalList={perThreadCpuAnnotationInterval}
          />
          <Collapsible
            unmountOnExit
            header={<div className="text-neutral-200 text-xl">{"Other threads"}</div>}
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
      )}
    </>
  );
};
