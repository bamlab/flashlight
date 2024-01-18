import { AndroidProfiler, FlashlightSelfProfiler } from "@perf-profiler/android";
import { IOSProfiler } from "@perf-profiler/ios";
import { IOSInstrumentsProfiler } from "@perf-profiler/ios-instruments";
import { Profiler } from "@perf-profiler/types";

const getProfiler = (): Profiler => {
  switch (process.env.PLATFORM) {
    case "ios":
      return new IOSProfiler();
    case "ios-instruments":
      return new IOSInstrumentsProfiler();
    case "flashlight":
      return new FlashlightSelfProfiler();
    default:
      return new AndroidProfiler();
  }
};

export const profiler: Profiler = getProfiler();

// TODO move this to a separate package
export { waitFor } from "@perf-profiler/android";
