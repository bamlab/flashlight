import { AndroidProfiler } from "@perf-profiler/android";
import { IOSProfiler } from "@perf-profiler/ios";
import { Profiler } from "@perf-profiler/types";

export const profiler: Profiler =
  process.env.PLATFORM === "ios" ? new IOSProfiler() : new AndroidProfiler();

// TODO move this to a separate package
export { waitFor } from "@perf-profiler/android";
