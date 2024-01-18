import { Measure, Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";
export { killApp } from "./utils/DeviceManager";

export class IOSInstrumentsProfiler implements Profiler {
  connectedDevice: IdbDevice | undefined;
  recordingProcess: ChildProcess | undefined;
  traceFile: string | undefined;
  pid: number | undefined;
  bundleId: string | undefined;
  onMeasure: ((measure: Measure) => void) | undefined;
  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    if (!this.pid) throw new Error("Profiler is not ready, app is not running");
    this.onMeasure = options.onMeasure;
    return {
      stop: () => {
        return;
      },
    };
  }

  detectCurrentBundleId(): string {
    throw new Error("App Id detection is not implemented on iOS with Instruments");
  }

  installProfilerOnDevice() {
    // Do we need anything here?
  }

  getScreenRecorder(videoPath: string): ScreenRecorder | undefined {
    return undefined;
  }

  cleanup: () => void = () => {
    // Do we need anything here?
  };
  async stopApp(bundleId: string): Promise<void> {
    killApp(bundleId);
    return new Promise<void>((resolve) => resolve());
  }
}
