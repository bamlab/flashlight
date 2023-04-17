import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import { IterationsReporterView } from "@perf-profiler/web-reporter-ui";

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
// testCaseResults = [
//   require("./example-reports/video/results_417dd25e-d901-4b1e-9d43-3b78305a48e2.json"),
//   require("./example-reports/video/results_c7d5d17d-42ed-4354-8b43-bb26e2d6feee.json"),
// ];

export function App() {
  return testCaseResults ? (
    <>
      <IterationsReporterView results={testCaseResults} />
    </>
  ) : null;
}
