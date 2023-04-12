import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import { IterationsReporterView } from "@perf-profiler/web-reporter-ui";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line prefer-const
let testCaseResults: TestCaseResult[] = "INSERT_HERE";

// Uncomment with when locally testing
// To add videos, run `cp packages/web-reporter/src/*.mp4 packages/web-reporter/dist`
// eslint-disable-next-line @typescript-eslint/no-var-requires
// testCaseResults = [
//   require("./results_1681294394706.json"),
//   require("./results_1681294744349.json"),
// ];

export function App() {
  return testCaseResults ? (
    <>
      <IterationsReporterView results={testCaseResults} />
    </>
  ) : null;
}
