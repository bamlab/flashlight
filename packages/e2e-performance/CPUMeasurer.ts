import {
  detectCurrentAppBundleId,
  getPidId,
  Measure,
  pollPerformanceMeasures,
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

export class CPUMeasurer {
  cpuMeasures: Measure[] = [];
  polling?: { stop: () => void };
  bundleId: string;

  constructor(bundleId: string) {
    this.bundleId = bundleId;
    this.start();
  }

  async start() {
    const pidId = await waitFor(() => {
      try {
        return getPidId(this.bundleId);
      } catch (error) {
        return null;
      }
    });

    this.polling = pollPerformanceMeasures(pidId, (measure) => {
      this.cpuMeasures.push(measure);
    });
  }

  stop() {
    this.polling?.stop();
    return this.cpuMeasures;
  }
}
