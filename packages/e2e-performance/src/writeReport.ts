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
    path,
    title: givenTitle,
    overrideScore,
  }: {
    path?: string;
    title?: string;
    overrideScore?: (result: AveragedTestCaseResult) => number;
  } = {}
) => {
  const title = givenTitle || "Results";
  const filePath =
    path ||
    `${process.cwd()}/${title
      .toLocaleLowerCase()
      .replace(/ /g, "_")}_${new Date().getTime()}.json`;

  const testCase: TestCaseResult = {
    name: title,
    iterations: measures,
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
