import { Logger } from "@perf-profiler/logger";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import {
  AveragedTestCaseResult,
  TestCaseIterationResult,
  TestCaseResult,
} from "@perf-profiler/types";
import fs from "fs";

export const writeReport = (
  measures: TestCaseIterationResult[],
  {
    filePath,
    title,
    overrideScore,
  }: {
    filePath: string;
    title: string;
    overrideScore?: (result: AveragedTestCaseResult) => number;
  }
) => {
  // We'll soon handle failed iterations as well
  const containsFailedIterations = measures.some(
    (measure) => measure.status === "FAILURE"
  );
  const testCase: TestCaseResult = {
    name: title,
    iterations: measures,
    status: containsFailedIterations ? "FAILURE" : "SUCCESS",
  };

  /**
   * Might not be the best place to put this since this is reporting
   * and not really measuring
   */
  if (overrideScore) {
    const averagedResult: AveragedTestCaseResult =
      averageTestCaseResult(testCase);
    testCase.score = Math.max(0, Math.min(overrideScore(averagedResult), 100));
  }

  fs.writeFileSync(filePath, JSON.stringify(testCase));

  Logger.success(
    `Results written to ${filePath}.
To open the web report, run:

flashlight report ${filePath}`
  );
};
