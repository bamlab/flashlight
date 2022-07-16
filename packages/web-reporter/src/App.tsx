import React from "react";
import { TestCaseIterationResult } from "@performance-profiler/types";
import { IterationsReporterView } from "@performance-profiler/web-reporter-ui";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line prefer-const
let testCaseResults: TestCaseIterationResult[] = "INSERT_HERE";

// Uncomment with when locally testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
testCaseResults = require("../../../results.json");

export function App() {
  return testCaseResults ? (
    <>
      <IterationsReporterView results={testCaseResults} />
    </>
  ) : null;
}
