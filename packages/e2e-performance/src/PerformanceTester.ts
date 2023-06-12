import { Logger } from "@perf-profiler/logger";
import {
  AveragedTestCaseResult,
  Measure,
  TestCaseIterationResult,
  TestCaseIterationStatus,
} from "@perf-profiler/types";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import {
  ensureCppProfilerIsInstalled,
  ScreenRecorder,
} from "@perf-profiler/profiler";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
  duration?: number;
  getScore?: (result: AveragedTestCaseResult) => number;
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

class SingleIterationTester {
  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options,
    private iterationCount: number
  ) {}

  private currentTestCaseIterationResult: TestCaseIterationResult | undefined =
    undefined;
  private performanceMeasurer: PerformanceMeasurer = new PerformanceMeasurer(
    this.bundleId
  );
  private videoName = `${this.options.resultsFileOptions.title}_iteration_${this.iterationCount}.mp4`;
  private recorder = new ScreenRecorder(this.videoName);

  public getCurrentTestCaseIterationResult() {
    return this.currentTestCaseIterationResult;
  }

  public async executeTestCase(): Promise<void> {
    const { beforeTest, run, afterTest, duration } = this.testCase;

    try {
      if (beforeTest) await beforeTest();

      await this.maybeStartRecording();

      this.performanceMeasurer.start();

      await run();
      const measures = await this.performanceMeasurer.stop(duration);
      await this.maybeStopRecording();

      if (afterTest) await afterTest();

      this.setCurrentTestCaseIterationResult(measures, "SUCCESS");
    } catch (error) {
      const measures = await this.performanceMeasurer?.stop();
      await this.maybeStopRecording();

      if (measures) {
        this.setCurrentTestCaseIterationResult(measures, "FAILURE");
      }

      this.performanceMeasurer.forceStop();
      throw new Error("Error while running test");
    }
  }

  private async maybeStartRecording() {
    if (this.options.recordOptions.record) {
      const { bitRate, size } = this.options.recordOptions;
      await this.recorder.startRecording({ bitRate, size });
    }
  }

  private async maybeStopRecording() {
    if (this.options.recordOptions.record) {
      await this.recorder.stopRecording();
      await this.recorder.pullRecording(this.options.resultsFileOptions.path);
    }
  }

  private setCurrentTestCaseIterationResult(
    measures: {
      time: number;
      startTime: number;
      measures: Measure[];
    },
    status: TestCaseIterationStatus
  ) {
    this.currentTestCaseIterationResult = {
      ...measures,
      status,
      videoInfos: this.options.recordOptions.record
        ? {
            path: `${this.options.resultsFileOptions.path}/${this.videoName}`,
            startOffset: Math.floor(
              measures.startTime - this.recorder.getRecordingStartTime()
            ),
          }
        : undefined,
    };
  }
}

export class PerformanceTester {
  public measures: TestCaseIterationResult[] = [];
  private currentTestCaseIterationResult: TestCaseIterationResult | undefined =
    undefined;
  private retryCount = 0;

  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options
  ) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  private async executeTestCase(iterationCount: number): Promise<void> {
    const singleIterationTester = new SingleIterationTester(
      this.bundleId,
      this.testCase,
      this.options,
      iterationCount
    );
    await singleIterationTester.executeTestCase();
    this.currentTestCaseIterationResult =
      singleIterationTester.getCurrentTestCaseIterationResult();
  }

  async iterate(): Promise<void> {
    let currentIterationIndex = 0;
    this.measures = [];

    while (currentIterationIndex < this.options.iterationCount) {
      Logger.info(
        `Running iteration ${currentIterationIndex + 1}/${
          this.options.iterationCount
        }`
      );
      try {
        await this.executeTestCase(currentIterationIndex);
        this.logSuccessfulIteration(currentIterationIndex);
        currentIterationIndex++;
      } catch (error) {
        this.logFailedIteration(currentIterationIndex, error);
        this.retryCount++;
        if (this.retryCount > this.options.maxRetries) {
          throw new Error("Max number of retries reached.");
        }
      } finally {
        if (this.currentTestCaseIterationResult) {
          this.measures.push(this.currentTestCaseIterationResult);
          this.currentTestCaseIterationResult = undefined;
        }
      }
    }

    if (this.measures.length === 0) {
      throw new Error("No measure returned");
    }
  }

  private logFailedIteration(currentIterationIndex: number, error: unknown) {
    Logger.error(
      `Iteration ${currentIterationIndex + 1}/${
        this.options.iterationCount
      } failed (ignoring measure): ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }

  private logSuccessfulIteration(currentIterationIndex: number) {
    Logger.success(
      `Finished iteration ${currentIterationIndex + 1}/${
        this.options.iterationCount
      } in ${this.currentTestCaseIterationResult?.time}ms (${this.retryCount} ${
        this.retryCount > 1 ? "retries" : "retry"
      } so far)`
    );
  }
}
