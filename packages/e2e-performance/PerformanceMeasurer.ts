import { Logger } from "@performance-profiler/logger";
import {
  getPidId,
  Measure,
  pollPerformanceMeasures,
  GfxInfoMeasure,
  parseGfxInfo,
  compareGfxMeasures,
} from "android-performance-profiler";

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

  constructor(bundleId: string) {
    this.bundleId = bundleId;
    this.start();
  }

  async start() {
    const pid = await waitFor(() => {
      try {
        return getPidId(this.bundleId);
      } catch (error) {
        Logger.info(`${this.bundleId} not yet started, retrying...`);
        return null;
      }
    });

    this.initialGfxInfoMeasure = parseGfxInfo(this.bundleId);

    this.polling = pollPerformanceMeasures(pid, (measure) => {
      this.cpuMeasures.push(measure);
    });
  }

  stop() {
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
