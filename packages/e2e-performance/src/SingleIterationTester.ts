import {
  AveragedTestCaseResult,
  Measure,
  TestCaseIterationResult,
  TestCaseIterationStatus,
} from "@perf-profiler/types";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import { ScreenRecorder } from "@perf-profiler/profiler";
import { basename, dirname } from "path";

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

export class SingleIterationTester {
  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options,
    private iterationIndex: number
  ) {}

  private currentTestCaseIterationResult: TestCaseIterationResult | undefined = undefined;
  private performanceMeasurer: PerformanceMeasurer = new PerformanceMeasurer(this.bundleId);
  private videoPath = `${this.options.resultsFileOptions.path.replace(".json", "")}_iteration_${
    this.iterationIndex
  }.mp4`;
  private recorder = new ScreenRecorder(basename(this.videoPath));

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
      const measures = await this.performanceMeasurer.stop();
      await this.maybeStopRecording();
      this.setCurrentTestCaseIterationResult(measures, "FAILURE");
      this.performanceMeasurer.forceStop();
      throw error;
    }
  }

  private async maybeStartRecording() {
    if (this.options.recordOptions.record) {
      const { bitRate, size } = this.options.recordOptions;
      await this.recorder.startRecording({ bitRate, size });
    }
  }

  public setIsRetry(isRetry: boolean) {
    if (this.currentTestCaseIterationResult) {
      this.currentTestCaseIterationResult.isRetriedIteration = isRetry;
    }
  }

  private async maybeStopRecording() {
    if (this.options.recordOptions.record) {
      await this.recorder.stopRecording();
      await this.recorder.pullRecording(dirname(this.options.resultsFileOptions.path));
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
            path: this.videoPath,
            startOffset: Math.floor(measures.startTime - this.recorder.getRecordingStartTime()),
          }
        : undefined,
    };
  }
}
