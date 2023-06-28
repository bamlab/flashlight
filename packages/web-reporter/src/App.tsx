import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import {
  Chart,
  IterationsReporterView,
  PageBackground,
  setThemeAtRandom,
} from "@perf-profiler/web-reporter-ui";

setThemeAtRandom();

const INTERVAL_MS = 10;

const getData = (res) => {
  const data: [number, number][] = res.map(([x, y]: [number, number]) => [
    x / 1_000_000,
    y,
  ]);

  const maxTime = data[data.length - 1][0];

  const intervalData: number[][] = Array(Math.floor(maxTime / INTERVAL_MS) + 1)
    .fill(null)
    .map(() => []);

  for (const [time, cpu] of data) {
    const index = Math.floor(time / INTERVAL_MS);
    intervalData[index].push(cpu);
  }

  const intervalDataAveraged = intervalData.map((values) =>
    values.length > 0 ? values.reduce((sum, curr) => sum + curr, 0) : 0
  );

  console.log(intervalDataAveraged.reduce((sum, curr) => sum + curr, 0));

  return intervalDataAveraged;
};

const results = [
  require("../../ios-poc/joli_test_2.json"),
  // require("../../ios-poc/cpu-profile-no-sr.json"),
  // require("../../ios-poc/cpu-profile-sr.json")
];

export function App() {
  // testCaseResults = useTimeSimulationResults();

  return (
    <Chart
      {...{
        title: "BONO°ORJ",
        series: results.map((res, index) => ({
          name: "OKOKO" + index,
          data: getData(res).map((y, index) => ({
            x: index * INTERVAL_MS,
            y,
          })),
        })),
        height: 200,
      }}
    />
  );
}
