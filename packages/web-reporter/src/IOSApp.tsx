import React from "react";
import { IOSTestCaseResult } from "@perf-profiler/types";
import { Chart, setThemeAtRandom } from "@perf-profiler/web-reporter-ui";

setThemeAtRandom();

const INTERVAL_MS = 1000;

const getData = (res: IOSTestCaseResult) => {
  const data: [number, number][] = res.measures.map(
    ([x, y]: [number, number]) => [x / 1_000_000, y]
  );

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

export function IOSApp({ results }: { results: IOSTestCaseResult[] }) {
  // testCaseResults = useTimeSimulationResults();

  return (
    <Chart
      {...{
        title: "iOS Performance measurement",
        series: results.map((res, index) => ({
          name: "Test run " + index,
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
