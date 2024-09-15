import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import {
  IterationsReporterView,
  PageBackground,
  setThemeAtRandom,
} from "@perf-profiler/web-reporter-ui";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line prefer-const
let testCaseResults: TestCaseResult[] =
  // Use very long string so that Parcel won't use it more than once, would be nice to find a better solution
  "THIS_IS_A_VERY_LONG_STRING_THAT_IS_UNLIKELY_TO_BE_FOUND_IN_A_TEST_CASE_RESULT";

// Uncomment with when locally testing
// // Without videos
// testCaseResults = [
//   require("./example-reports/results1.json"),
//   require("./example-reports/results2.json"),
// ];
// // With videos, you have to run `cp packages/commands/report/src/example-reports/**/*.mp4 packages/commands/report/dist`
// testCaseResults = [
//   require("./example-reports/video/results_417dd25e-d901-4b1e-9d43-3b78305a48e2.json"),
//   require("./example-reports/video/results_c7d5d17d-42ed-4354-8b43-bb26e2d6feee.json"),
// ];
// IOS Experimental
// testCaseResults = [
//   require("./example-reports/ios/ios_1.json"),
//   require("./example-reports/ios/ios_2.json"),
// ];

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
  if (!testCaseResults) return null;

  return (
    <>
      <PageBackground />
      <IterationsReporterView results={testCaseResults} />
    </>
  );
}
