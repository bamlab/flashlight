import { Logger } from "@performance-profiler/logger";
import { Measure } from "android-performance-profiler";
import { CPUMeasurer } from "./CPUMeasurer";
import { Trace } from "./Trace";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
}

export class PerformanceTester {
  measures: {
    coldStartTime: number;
    cpuMeasures: Measure[];
  }[] = [];
  constructor(private bundleId: string) {}

  async executeTestCase({ beforeTest, run, afterTest }: TestCase) {
    if (beforeTest) await beforeTest();

    const cpuMeasurer = new CPUMeasurer(this.bundleId);

    const startTimeTrace = new Trace();
    await run();
    const coldStartTime = startTimeTrace.stop();

    if (afterTest) await afterTest();

    const cpuMeasures = cpuMeasurer.stop();

    this.measures.push({
      coldStartTime,
      cpuMeasures,
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
