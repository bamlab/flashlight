import { Logger } from "@perf-profiler/logger";
import { profiler, waitFor } from "@perf-profiler/profiler";
import { basename, dirname } from "path";
import { Trace } from "./Trace";
import { Measure, POLLING_INTERVAL, TestCaseIterationResult } from "@perf-profiler/types";

export class PerformanceMeasurer {
  measures: Measure[] = [];
  polling?: { stop: () => void };
  shouldStop = false;
  timingTrace?: Trace;

  constructor(
    private bundleId: string,
    private options: {
      recordOptions:
        | { record: false }
        | {
            record: true;
            size?: string;
            bitRate?: number;
            videoPath: string;
          };
    }
  ) {}

  private recorder = this.options.recordOptions.record
    ? profiler.getScreenRecorder(basename(this.options.recordOptions.videoPath))
    : null;

  async start(
    onMeasure: (measure: Measure) => void = () => {
      // noop by default
    }
  ) {
    await this.maybeStartRecording();

    // Hack to make sure the profiler is ready to receive measures
    await profiler.waitUntilReady(this.bundleId);
    this.polling = profiler.pollPerformanceMeasures(this.bundleId, {
      onMeasure: (measure) => {
        // The ios-instruments profiler yields measures at the end of the test when the polling is already stopped
        if (this.shouldStop && process.env.PLATFORM !== "ios-instruments") {
          this.polling?.stop();
        }

        this.measures.push(measure);
        onMeasure(measure);
        Logger.debug(`Received measure ${this.measures.length}`);
      },
      onStartMeasuring: () => {
        this.measures = [];
        this.timingTrace = new Trace();
      },
    });
  }

  async forceStop() {
    // Ensure polling has stopped
    this.polling?.stop();
    // Hack for ios-instruments to get the measures at the end of the test
    await profiler.getMeasures();
  }

  async stop(duration?: number): Promise<TestCaseIterationResult> {
    const time = this.timingTrace?.stop();

    if (duration) {
      // Hack to wait for the duration to be reached in case test case has finished before
      await waitFor(() => this.measures.length * POLLING_INTERVAL > duration, {
        checkInterval: POLLING_INTERVAL,
        timeout: duration * 2,
        errorMessage:
          "We don't have enough measures for the duration of the test specified, maybe the app has crashed?",
      });
      this.measures = this.measures.slice(0, duration / POLLING_INTERVAL + 1);
    } else {
      this.shouldStop = true;
      // Hack to wait for the last measures to be received
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL * 2));
    }

    await this.forceStop();

    await this.maybeStopRecording();

    const startTime = this.timingTrace?.startTime ?? 0;

    return {
      time: time ?? 0,
      startTime,
      measures: this.measures,
      status: "SUCCESS",
      videoInfos:
        this.options.recordOptions.record && this.recorder
          ? {
              path: this.options.recordOptions.videoPath,
              startOffset: Math.floor(startTime - this.recorder.getRecordingStartTime()),
            }
          : undefined,
    };
  }

  private async maybeStartRecording() {
    if (this.options.recordOptions.record && this.recorder) {
      const { bitRate, size } = this.options.recordOptions;
      await this.recorder.startRecording({ bitRate, size });
    }
  }

  private async maybeStopRecording() {
    if (this.options.recordOptions.record && this.recorder) {
      await this.recorder.stopRecording();
      await this.recorder.pullRecording(dirname(this.options.recordOptions.videoPath));
    }
  }
}
