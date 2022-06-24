import { Logger } from "@performance-profiler/logger";
import { Measure } from "android-performance-profiler";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { Trace } from "./Trace";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
}

export class PerformanceTester {
  measures: {
    time: number;
    measures: Measure[];
  }[] = [];
  constructor(private bundleId: string) {}

  async executeTestCase({ beforeTest, run, afterTest }: TestCase) {
    if (beforeTest) await beforeTest();

    const performanceMeasurer = new PerformanceMeasurer(this.bundleId);

    const startTimeTrace = new Trace();
    await run();
    const time = startTimeTrace.stop();

    if (afterTest) await afterTest();

    const cpuMeasures = performanceMeasurer.stop();

    this.measures.push({
      time,
      ...cpuMeasures,
    });
  }

  async iterate(testCase: TestCase, iterationCount = 10) {
    for (let i = 0; i < iterationCount; i++) {
      Logger.info(`Running iteration ${i + 1}/${iterationCount}`);
      await this.executeTestCase(testCase);
    }

    return this.measures;
  }
}
