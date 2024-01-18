import { AndroidProfiler } from "@perf-profiler/android";
import { IOSProfiler } from "@perf-profiler/ios";
import { IOSInstrumentsProfiler } from "@perf-profiler/ios-instruments";
import { Profiler } from "@perf-profiler/types";

export const profiler: Profiler = (() => {
  switch (process.env.PLATFORM) {
    case "android":
      return new AndroidProfiler();
    case "ios":
      return new IOSProfiler();
    case "ios-instruments":
      return new IOSInstrumentsProfiler();
    default:
      return new AndroidProfiler();
  }
})();

// TODO move this to a separate package
export { waitFor } from "@perf-profiler/android";
