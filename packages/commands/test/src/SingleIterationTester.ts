import {
  AveragedTestCaseResult,
  TestCaseIterationResult,
  TestCaseIterationStatus,
} from "@perf-profiler/types";
import { PerformanceMeasurer } from "./PerformanceMeasurer";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
  duration?: number;
  getScore?: (result: AveragedTestCaseResult, refreshRate: number) => number;
}

export interface Options {
  iterationCount: number;
  maxRetries: number;
  recordOptions: {
    record: boolean;
    size?: string;
    bitRate?: number;
  };
  resultsFileOptions: {
    path: string;
    title: string;
  };
}

export class SingleIterationTester {
  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options,
    private iterationIndex: number
  ) {}

  private currentTestCaseIterationResult: TestCaseIterationResult | undefined = undefined;
  private videoPath = `${this.options.resultsFileOptions.path.replace(".json", "")}_iteration_${
    this.iterationIndex
  }_${new Date().getTime()}.mp4`;
  private performanceMeasurer: PerformanceMeasurer = new PerformanceMeasurer(this.bundleId, {
    recordOptions: {
      ...this.options.recordOptions,
      videoPath: this.videoPath,
    },
  });

  public getCurrentTestCaseIterationResult() {
    return this.currentTestCaseIterationResult;
  }

  public async executeTestCase(): Promise<void> {
    const { beforeTest, run, afterTest, duration } = this.testCase;

    try {
      if (beforeTest) await beforeTest();

      await this.performanceMeasurer.start();
      await run();
      const measures = await this.performanceMeasurer.stop(duration);

      if (afterTest) await afterTest();

      this.setCurrentTestCaseIterationResult(measures, "SUCCESS");
    } catch (error) {
      const measures = await this.performanceMeasurer.stop();
      this.setCurrentTestCaseIterationResult(measures, "FAILURE");
      this.performanceMeasurer.forceStop();
      throw error;
    }
  }

  public setIsRetry(isRetry: boolean) {
    if (this.currentTestCaseIterationResult) {
      this.currentTestCaseIterationResult.isRetriedIteration = isRetry;
    }
  }

  private setCurrentTestCaseIterationResult(
    measures: TestCaseIterationResult,
    status: TestCaseIterationStatus
  ) {
    this.currentTestCaseIterationResult = {
      ...measures,
      status,
    };
  }
}
