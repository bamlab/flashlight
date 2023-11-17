import { Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";

export class IOSProfiler implements Profiler {
  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    throw new Error("Performance polling is not implemented on iOS");
  }

  detectCurrentBundleId(): string {
    throw new Error("App Id detection is not implemented on iOS");
  }

  installProfilerOnDevice() {
    // Do we need anything here?
  }

  getScreenRecorder(videoPath: string): ScreenRecorder {
    throw new Error("Screen recording is not implemented on iOS");
  }

  cleanup: () => void = () => {
    // Do we need anything here?
  };
}
