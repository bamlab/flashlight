import { Logger } from "@perf-profiler/logger";
import { TestCaseIterationResult, TestCaseResult } from "@perf-profiler/types";
import fs from "fs";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { Trace } from "./Trace";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
  duration?: number;
}

class PerformanceTester {
  constructor(private bundleId: string) {}

  private async executeTestCase({
    beforeTest,
    run,
    afterTest,
    duration,
  }: TestCase): Promise<TestCaseIterationResult> {
    if (beforeTest) await beforeTest();

    const performanceMeasurer = new PerformanceMeasurer(this.bundleId);
    // We don't await here to not block the thread
    // but it's not ideal, we could spawn a worker for the measurer
    performanceMeasurer.start();

    const startTimeTrace = new Trace();
    await run();
    const time = startTimeTrace.stop();

    const cpuMeasures = await performanceMeasurer.stop(duration);

    if (afterTest) await afterTest();

    return {
      time,
      ...cpuMeasures,
    };
  }

  async iterate(
    testCase: TestCase,
    iterationCount: number
  ): Promise<TestCaseIterationResult[]> {
    const measures: TestCaseIterationResult[] = [];

    for (let i = 0; i < iterationCount; i++) {
      Logger.info(`Running iteration ${i + 1}/${iterationCount}`);
      const measure = await this.executeTestCase(testCase);
      Logger.success(
        `Finished iteration ${i + 1}/${iterationCount} in ${measure.time}ms`
      );
    }

    return measures;
  }

  public static writeResults(
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
    fs.writeFileSync(filePath, JSON.stringify(testCase));

    Logger.success(`Results written to ${filePath}`);
  }
}

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  iterationCount = 10
) => {
  const measures = await new PerformanceTester(bundleId).iterate(
    testCase,
    iterationCount
  );

  return {
    measures,
    writeResults: (options: { path?: string; title?: string } = {}) =>
      PerformanceTester.writeResults(measures, options),
  };
};
