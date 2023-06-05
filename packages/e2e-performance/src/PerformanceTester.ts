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

  constructor(private bundleId: string, private testCase: TestCase) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  private async executeTestCase(
    iterationCount: number,
    recordOptions: RecordOptions
  ): Promise<void> {
    let performanceMeasurer: PerformanceMeasurer | null = null;

    const { beforeTest, run, afterTest, duration } = this.testCase;

    if (beforeTest) await beforeTest();

    const videoName = `${recordOptions.title}_iteration_${iterationCount}.mp4`;
    const recorder = new ScreenRecorder(videoName);
    if (recordOptions.record) {
      const { bitRate, size } = recordOptions;
      await recorder.startRecording({ bitRate, size });
    }

    performanceMeasurer = new PerformanceMeasurer(this.bundleId);

    try {
      performanceMeasurer.start();

      await run();
      const measures = await performanceMeasurer.stop(duration);
      if (recordOptions.record) {
        await recorder.stopRecording();
        await recorder.pullRecording(recordOptions.path);
      }

      if (afterTest) await afterTest();

      if (recordOptions.record) {
        this.currentTestCaseIterationResult = {
          ...measures,
          status: "SUCCESS",
          videoInfos: {
            path: `${recordOptions.path}/${videoName}`,
            startOffset: Math.floor(
              measures.startTime - recorder.getRecordingStartTime()
            ),
          },
        };
        return;
      }

      this.currentTestCaseIterationResult = { ...measures, status: "SUCCESS" };
      return;
    } catch (error) {
      const measures = await performanceMeasurer.stop();
      this.currentTestCaseIterationResult = { ...measures, status: "FAILURE" };
      performanceMeasurer?.forceStop();
      throw new Error("Error while running test");
    }
  }

  async iterate(
    iterationCount: number,
    maxRetries: number,
    recordOptions: RecordOptions
  ): Promise<void> {
    let retriesCount = 0;
    let currentIterationIndex = 0;
    this.measures = [];

    while (currentIterationIndex < iterationCount) {
      Logger.info(
        `Running iteration ${currentIterationIndex + 1}/${iterationCount}`
      );
      try {
        await this.executeTestCase(currentIterationIndex, recordOptions);
        Logger.success(
          `Finished iteration ${
            currentIterationIndex + 1
          }/${iterationCount} in ${
            this.currentTestCaseIterationResult?.time
          }ms (${retriesCount} ${
            retriesCount > 1 ? "retries" : "retry"
          } so far)`
        );

        currentIterationIndex++;
      } catch (error) {
        Logger.error(
          `Iteration ${
            currentIterationIndex + 1
          }/${iterationCount} failed (ignoring measure): ${
            error instanceof Error ? error.message : "unknown error"
          }`
        );

        retriesCount++;
        if (retriesCount > maxRetries) {
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
}
