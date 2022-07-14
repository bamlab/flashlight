import React from "react";
import {
  ComparisonView,
  ReporterView,
} from "@performance-profiler/web-reporter-ui";
import { TestCaseIterationResult } from "@performance-profiler/types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const testCaseResults: TestCaseIterationResult[] = "INSERT_HERE";

export function App() {
  return testCaseResults ? (
    <>
      <ReporterView measures={testCaseResults[5].measures} />
    </>
  ) : null;
}
