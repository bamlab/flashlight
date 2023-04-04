import React from "react";
import { TestCaseResult } from "@perf-profiler/types";
import {
  IterationsReporterView,
  PageBackground,
  useSetThemeAtRandom,
} from "@perf-profiler/web-reporter-ui";
import "@perf-profiler/web-reporter-ui/index.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line prefer-const
let testCaseResults: TestCaseResult[] = "INSERT_HERE";

// Uncomment with when locally testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
// testCaseResults = [require("./results1.json"), require("./results2.json")];

export function App() {
  useSetThemeAtRandom();

  return testCaseResults ? (
    <>
      <PageBackground />
      <IterationsReporterView results={testCaseResults} />
    </>
  ) : null;
}
