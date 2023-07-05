import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import {
  IterationsReporterView,
  PageBackground,
  setThemeAtRandom,
} from "@perf-profiler/web-reporter-ui";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line prefer-const
let testCaseResults: TestCaseResult[] = "INSERT_HERE";

// Uncomment with when locally testing
// // Without videos
// testCaseResults = [
//   require("./example-reports/results1.json"),
//   require("./example-reports/results2.json"),
// ];
// // With videos, you have to run `cp packages/web-reporter/src/example-reports/**/*.mp4 packages/web-reporter/dist`
testCaseResults = [
  require("./example-reports/video/results_417dd25e-d901-4b1e-9d43-3b78305a48e2.json"),
  require("./example-reports/video/results_c7d5d17d-42ed-4354-8b43-bb26e2d6feee.json"),
];

// Uncomment when testing with time simulation
// -------------------------------------------
// const useTimeSimulationResults = () => {
//   // increment i every 500ms
//   const [measureIndex, setMeasureIndex] = React.useState(1);

//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       setMeasureIndex((measureIndex) => measureIndex + 1);
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   return testCaseResults.map((testCaseResult) => ({
//     ...testCaseResult,
//     iterations: testCaseResult.iterations.map((iteration) => ({
//       ...iteration,
//       measures: iteration.measures.slice(0, measureIndex),
//     })),
//   }));
// };

setThemeAtRandom();

export function App() {
  // testCaseResults = useTimeSimulationResults();

  return testCaseResults ? (
    <>
      <PageBackground />
      <IterationsReporterView results={testCaseResults} />
    </>
  ) : null;
}
