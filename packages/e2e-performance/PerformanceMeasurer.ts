import { Logger } from "@performance-profiler/logger";
import {
  getPidId,
  Measure,
  pollPerformanceMeasures,
  GfxInfoMeasure,
  parseGfxInfo,
  compareGfxMeasures,
} from "@performance-profiler/profiler";

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
  initialGfxInfoMeasure?: GfxInfoMeasure;
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

    this.initialGfxInfoMeasure = parseGfxInfo(this.bundleId);

    this.polling = pollPerformanceMeasures(pid, (measure) => {
      if (this.shouldStop) {
        this.polling?.stop();
      }

      this.cpuMeasures.push(measure);
      Logger.debug(`Received measure ${this.cpuMeasures.length}`);
    });
  }

  async stop() {
    this.shouldStop = true;
    // Hack to wait for the last measures to be received
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Ensure polling has stopped
    this.polling?.stop();

    if (!this.initialGfxInfoMeasure) {
      throw new Error("PerformanceMeasurer was not properly started");
    }

    return {
      measures: this.cpuMeasures,
      gfxInfo: compareGfxMeasures(
        this.initialGfxInfoMeasure,
        parseGfxInfo(this.bundleId)
      ),
    };
  }
}
