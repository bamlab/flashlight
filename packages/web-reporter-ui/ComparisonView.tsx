import React from "react";
import {
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getAverageRAMUsage,
  getHighCpuUsageStats,
} from "@performance-profiler/reporter";
import { Measure, TestCaseIterationResult } from "@performance-profiler/types";
import { Chart } from "./components/Chart";
import { ReportTable } from "./components/ReportTable";
import { roundToDecimal } from "./utils/roundToDecimal";

const phoneName: "J3" | "S10" | "S8" = "J3";

const getJsThreadAverage = (measures: Measure[]) =>
  getAverageCpuUsagePerProcess(measures).find(
    (t) => t.processName === "(mqt_js)"
  )?.cpuUsage || 0;

interface TestCaseResult {
  name: string;
  iterations: TestCaseIterationResult[];
}

const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

const printStats = ({ name, iterations }: TestCaseResult) => {
  return {
    name: name,
    stats: [
      {
        name: "Average CPU usage",
        value:
          roundToDecimal(
            average(
              iterations.map((measure) => getAverageCpuUsage(measure.measures))
            ),
            0
          ) + "%",
      },
      {
        name: "Average RAM usage",
        value:
          roundToDecimal(
            average(
              iterations.map((measure) => getAverageRAMUsage(measure.measures))
            ),
            0
          ) + "MB",
      },
      {
        name: "Missed frames",
        value:
          roundToDecimal(
            average(
              iterations.map(
                (measure) =>
                  measure.gfxInfo.histogram.reduce(
                    (count, value) =>
                      count + (value.renderingTime > 16 ? value.frameCount : 0),
                    0
                  ) / measure.gfxInfo.frameCount
              )
            ) * 100,
            1
          ) + "%",
      },
      {
        name: "Average frame render time (ms)",
        value: `${roundToDecimal(
          average(
            iterations.map(
              (measure) =>
                measure.gfxInfo.renderTime / measure.gfxInfo.frameCount
            )
          ),
          1
        )}ms for ${roundToDecimal(
          average(iterations.map((measure) => measure.gfxInfo.frameCount)),
          0
        )} frames`,
      },
    ],
  };
};
// console.log(flat.map((measure) => getHighCpuUsageStats(measure.measures)).reduce((aggr, stats) => ({
//   ...aggr,
//   [stats]
// })));

export const ComparisonView = ({
  testCaseResults,
}: {
  testCaseResults: TestCaseResult[];
}) => {
  const getAllIterationsSeries = (
    testCaseResults: TestCaseResult[],
    calculate: (measure: Measure[]) => number
  ) =>
    testCaseResults
      .map((testCaseResult) =>
        testCaseResult.iterations.map((iteration, i) => ({
          name: `${testCaseResult.name} ${i + 1}`,
          type: "area",
          data: [
            ...iteration.measures
              .map((measure) => calculate([measure]) || 0)
              .map((value, i) => ({
                x: 500 * i,
                y: Math.min(value, 400),
              })),
          ],
        }))
      )
      .flat();

  const getAverage = (
    measures: TestCaseIterationResult[],
    calculate: (measure: Measure[]) => number
  ) =>
    Array(Math.min(...measures.map((measures) => measures.measures.length)))
      .fill(null)
      .map((_, stepIndex) =>
        Math.floor(
          average(
            measures
              .map((measure, i) =>
                measure.measures[stepIndex]
                  ? calculate([measure.measures[stepIndex]])
                  : 0
              )
              .filter(Boolean)
          )
        )
      );

  const buildSeries = (
    testCaseResults: TestCaseResult[],
    calculate: (measure: Measure[]) => number
  ) => {
    const averaged = testCaseResults.map((testCaseResult) =>
      getAverage(testCaseResult.iterations, calculate)
    );

    return averaged.map((result, i) => ({
      name: testCaseResults[i].name,
      data: Array(Math.min(...averaged.map((a) => a.length)))
        .fill(null)
        .map((_, i) => ({
          x: i * 500,
          y: result[i] || 0,
        })),
    }));
  };

  return (
    <>
      <ReportTable rows={testCaseResults.map(printStats)} />
      <br></br>
      <Chart
        title={`Total CPU Usage (%) on ${phoneName} (Average of 10 iterations - ${testCaseResults[0].name} 🔴 vs ${testCaseResults[1].name} 🔵)`}
        height={500}
        series={buildSeries(testCaseResults, getAverageCpuUsage)}
        colors={["#ff0000", "#0000ff"]}
      />
      <Chart
        title={`RAM Usage (MB) on ${phoneName} (Average of 10 iterations - ${testCaseResults[0].name} 🔴 vs ${testCaseResults[1].name} 🔵)`}
        height={500}
        series={buildSeries(testCaseResults, getAverageRAMUsage)}
        colors={["#ff0000", "#0000ff"]}
      />
      <Chart
        title={`Total CPU Usage (%) on ${phoneName} (All iterations - ${testCaseResults[0].name} 🔴 vs ${testCaseResults[1].name} 🔵)`}
        height={500}
        series={getAllIterationsSeries(testCaseResults, getAverageCpuUsage)}
        colors={[
          ...Array(10).fill("#ff000050"),
          ...Array(10).fill("#0000ff50"),
        ]}
      />
    </>
  );
};
