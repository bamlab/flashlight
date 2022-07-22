import { Logger } from "@perf-profiler/logger";
import {
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";

const waitFor = async <T>(
  evaluateResult: () => T | undefined | null,
  { timeout, checkInterval }: { timeout: number; checkInterval: number } = {
    timeout: 10000,
    checkInterval: 50,
  }
): Promise<T> => {
  if (timeout < 0) {
    throw new Error("Waited for condition which never happened");
  }
  const result = evaluateResult();
  if (result) return result;

  await new Promise((resolve) => setTimeout(resolve, checkInterval));

  return waitFor(evaluateResult, {
    timeout: timeout - checkInterval,
    checkInterval,
  });
};

export class PerformanceMeasurer {
  cpuMeasures: Measure[] = [];
  polling?: { stop: () => void };
  bundleId: string;
  shouldStop = false;

  constructor(bundleId: string) {
    this.bundleId = bundleId;
  }

  async start() {
    const pid = await waitFor(
      () => {
        try {
          return getPidId(this.bundleId);
        } catch (error) {
          Logger.debug(`${this.bundleId} not yet started, retrying...`);
          return null;
        }
      },
      {
        timeout: 10000,
        // we don't add any timeout since `adb pidof` already takes a bit of time
        checkInterval: 0,
      }
    );

    this.polling = pollPerformanceMeasures(pid, (measure) => {
      if (this.shouldStop) {
        this.polling?.stop();
      }

      this.cpuMeasures.push(measure);
      Logger.debug(`Received measure ${this.cpuMeasures.length}`);
    });
  }

  async stop(duration?: number) {
    const TIME_INTERVAL_IN_MS = 500;
    if (duration) {
      // Hack to wait for the duration to be reached in case test case has finished before
      await waitFor(
        () => this.cpuMeasures.length * TIME_INTERVAL_IN_MS > duration,
        {
          checkInterval: TIME_INTERVAL_IN_MS,
          timeout: duration * 1000,
        }
      );
      this.cpuMeasures = this.cpuMeasures.slice(
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
      measures: this.cpuMeasures,
    };
  }
}
