import { Logger } from "@perf-profiler/logger";
import {
  AveragedTestCaseResult,
  TestCaseIterationResult,
  TestCaseResult,
} from "@perf-profiler/types";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import fs from "fs";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { ensureCppProfilerIsInstalled } from "@perf-profiler/profiler";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
  duration?: number;
  getScore?: (result: AveragedTestCaseResult) => number;
}

class PerformanceTester {
  constructor(private bundleId: string, private testCase: TestCase) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  private async executeTestCase(): Promise<TestCaseIterationResult> {
    try {
      const { beforeTest, run, afterTest, duration } = this.testCase;

      if (beforeTest) await beforeTest();

      const performanceMeasurer = new PerformanceMeasurer(this.bundleId);
      // We don't await here to not block the thread
      // but it's not ideal, we could spawn a worker for the measurer
      performanceMeasurer.start();
      await run();
      const measures = await performanceMeasurer.stop(duration);

      if (afterTest) await afterTest();

      return measures;
    } catch (error) {
      throw new Error("Error while running test");
    }
  }

  async iterate(iterationCount: number): Promise<TestCaseIterationResult[]> {
    const measures: TestCaseIterationResult[] = [];

    for (let i = 0; i < iterationCount; i++) {
      Logger.info(`Running iteration ${i + 1}/${iterationCount}`);
      try {
        const measure = await this.executeTestCase();
        Logger.success(
          `Finished iteration ${i + 1}/${iterationCount} in ${measure.time}ms`
        );
        measures.push(measure);
      } catch (error) {
        Logger.error(
          `Iteration ${i + 1}/${iterationCount} failed (ignoring measure): ${
            error instanceof Error ? error.message : "unknown error"
          }`
        );
      }
    }

    if (measures.length === 0) {
      throw new Error("No measure returned");
    }

    return measures;
  }

  public writeResults(
    measures: TestCaseIterationResult[],
    { path, title: givenTitle }: { path?: string; title?: string } = {}
  ) {
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
    if (this.testCase.getScore) {
      const averagedResult: AveragedTestCaseResult =
        averageTestCaseResult(testCase);
      testCase.score = Math.max(
        0,
        Math.min(this.testCase.getScore(averagedResult), 100)
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(testCase));

    Logger.success(
      `Results written to ${filePath}. To open the web report, run:
npx @perf-profiler/web-reporter ${filePath}`
    );
  }
}

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  iterationCount = 10
) => {
  const tester = new PerformanceTester(bundleId, testCase);
  const measures = await tester.iterate(iterationCount);

  return {
    measures,
    writeResults: (options: { path?: string; title?: string } = {}) =>
      tester.writeResults(measures, options),
  };
};
