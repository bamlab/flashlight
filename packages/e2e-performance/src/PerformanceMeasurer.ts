import { Logger } from "@perf-profiler/logger";
import { Measure, pollPerformanceMeasures } from "@perf-profiler/profiler";
import { Trace } from "./Trace";
import { waitFor } from "./utils/waitFor";

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
    this.polling = pollPerformanceMeasures(this.bundleId, {
      onMeasure: (measure) => {
        if (this.shouldStop) {
          this.polling?.stop();
        }

        this.measures.push(measure);
        onMeasure(measure);
        Logger.debug(`Received measure ${this.measures.length}`);
      },
      onStartMeasuring: () => {
        this.timingTrace = new Trace();
      },
    });
  }

  async stop(duration?: number) {
    const time = this.timingTrace?.stop();

    const TIME_INTERVAL_IN_MS = 500;
    if (duration) {
      // Hack to wait for the duration to be reached in case test case has finished before
      await waitFor(
        () => this.measures.length * TIME_INTERVAL_IN_MS > duration,
        {
          checkInterval: TIME_INTERVAL_IN_MS,
          timeout: duration * 1000,
        }
      );
      this.measures = this.measures.slice(
        0,
        duration / TIME_INTERVAL_IN_MS + 1
      );
    } else {
      this.shouldStop = true;
      // Hack to wait for the last measures to be received
      await new Promise((resolve) =>
        setTimeout(resolve, TIME_INTERVAL_IN_MS * 2)
      );
    }

    // Ensure polling has stopped
    this.polling?.stop();

    return {
      time: time ?? 0,
      measures: this.measures,
    };
  }
}
