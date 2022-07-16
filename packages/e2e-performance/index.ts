import { Logger } from "@performance-profiler/logger";
import { TestCaseIterationResult } from "@performance-profiler/types";
import fs from "fs";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { Trace } from "./Trace";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
}

export class PerformanceTester {
  measures: TestCaseIterationResult[] = [];
  constructor(private bundleId: string) {}

  async executeTestCase({ beforeTest, run, afterTest }: TestCase) {
    if (beforeTest) await beforeTest();

    const performanceMeasurer = new PerformanceMeasurer(this.bundleId);
    // We don't await here to not block the thread
    // but it's not ideal, we could spawn a worker for the measurer
    performanceMeasurer.start();

    const startTimeTrace = new Trace();
    await run();
    const time = startTimeTrace.stop();

    if (afterTest) await afterTest();

    const cpuMeasures = await performanceMeasurer.stop();

    this.measures.push({
      time,
      ...cpuMeasures,
    });
  }

  async iterate(testCase: TestCase, iterationCount = 10) {
    for (let i = 0; i < iterationCount; i++) {
      Logger.info(`Running iteration ${i + 1}/${iterationCount}`);
      await this.executeTestCase(testCase);
      Logger.success(
        `Finished iteration ${i + 1}/${iterationCount} in ${
          this.measures[i].time
        }ms`
      );
    }

    return this.measures;
  }

  writeResults(filePath?: string) {
    const path =
      filePath || `${process.cwd()}/results_${new Date().getTime()}.json`;
    fs.writeFileSync(path, JSON.stringify(this.measures));

    Logger.success(`Results written to ${path}`);
  }
}
