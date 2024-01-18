import { Logger } from "@perf-profiler/logger";
import { profiler, waitFor } from "@perf-profiler/profiler";
import { Trace } from "./Trace";
import { Measure, POLLING_INTERVAL } from "@perf-profiler/types";

export class PerformanceMeasurer {
  measures: Measure[] = [];
  polling?: { stop: () => void };
  bundleId: string;
  shouldStop = false;
  timingTrace?: Trace;

  constructor(bundleId: string) {
    this.bundleId = bundleId;
  }

  async start(
    onMeasure: (measure: Measure) => void = () => {
      // noop by default
    }
  ) {
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

  forceStop() {
    this.polling?.stop();
  }

  async stop(duration?: number) {
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

    // Ensure polling has stopped
    this.polling?.stop();
    // Hack for ios-instruments to get the measures at the end of the test
    await profiler.getMeasures();

    return {
      time: time ?? 0,
      startTime: this.timingTrace?.startTime ?? 0,
      measures: this.measures,
    };
  }
}
