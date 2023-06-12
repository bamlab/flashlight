import { Logger } from "@perf-profiler/logger";
import {
  AveragedTestCaseResult,
  TestCaseIterationResult,
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

export interface RecordOptions {
  record: boolean;
  path: string;
  title: string;
  bitRate?: number;
  size?: string;
}

export class PerformanceTester {
  public measures: TestCaseIterationResult[] = [];
  private currentTestCaseIterationResult: TestCaseIterationResult | undefined =
    undefined;
  private retryCount = 0;
  private performanceMeasurer: PerformanceMeasurer = new PerformanceMeasurer(
    this.bundleId
  );

  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options
  ) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  private async executeTestCase(
    iterationCount: number,
    recordOptions: RecordOptions
  ): Promise<void> {
    const videoName = `${recordOptions.title}_iteration_${iterationCount}.mp4`;
    const recorder = new ScreenRecorder(videoName);

    const { beforeTest, run, afterTest, duration } = this.testCase;

    try {
      if (beforeTest) await beforeTest();

      if (recordOptions.record) {
        const { bitRate, size } = recordOptions;
        await recorder.startRecording({ bitRate, size });
      }

      this.performanceMeasurer.start();

      await run();
      const measures = await this.performanceMeasurer.stop(duration);
      if (recordOptions.record) {
        await recorder.stopRecording();
        await recorder.pullRecording(recordOptions.path);
      }

      if (afterTest) await afterTest();

      this.currentTestCaseIterationResult = {
        ...measures,
        status: "SUCCESS",
        videoInfos: recordOptions.record
          ? {
              path: `${recordOptions.path}/${videoName}`,
              startOffset: Math.floor(
                measures.startTime - recorder.getRecordingStartTime()
              ),
            }
          : undefined,
      };
    } catch (error) {
      const measures = await this.performanceMeasurer?.stop();
      if (measures) {
        if (recordOptions.record) {
          await recorder?.stopRecording();
          await recorder?.pullRecording(recordOptions.path);
        }
        this.currentTestCaseIterationResult = {
          ...measures,
          status: "FAILURE",
          videoInfos: recordOptions.record
            ? {
                path: `${recordOptions.path}/${videoName}`,
                startOffset: Math.floor(
                  measures.startTime - recorder.getRecordingStartTime()
                ),
              }
            : undefined,
        };
      }

      this.performanceMeasurer?.forceStop();
      throw new Error("Error while running test");
    }
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
        await this.executeTestCase(currentIterationIndex, {
          ...this.options.recordOptions,
          ...this.options.resultsFileOptions,
        });
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
