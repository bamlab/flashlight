import { Logger } from "@performance-profiler/logger";
import { Measure } from "@performance-profiler/profiler";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { Trace } from "./Trace";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
}

export interface PerformanceTesterMeasure {
  time: number;
  measures: Measure[];
}

export class PerformanceTester {
  measures: PerformanceTesterMeasure[] = [];
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
