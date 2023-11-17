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
    this.polling = profiler.pollPerformanceMeasures(this.bundleId, {
      onMeasure: (measure) => {
        if (this.shouldStop) {
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

    return {
      time: time ?? 0,
      startTime: this.timingTrace?.startTime ?? 0,
      measures: this.measures,
    };
  }
}
