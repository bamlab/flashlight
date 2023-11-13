import { pollPerformanceMeasures } from "./commands/pollPerformanceMeasures";
import { ensureCppProfilerIsInstalled } from "./commands/cppProfiler";
import { cleanup } from "./commands/shell";
import { ScreenRecorder } from "./commands/ScreenRecorder";
import { profiler } from "./commands/platforms/platformProfiler";
import { Profiler } from "@perf-profiler/types";

export { Measure } from "@perf-profiler/types";
export { Measure as GfxInfoMeasure } from "./commands/gfxInfo/parseGfxInfo";
export { waitFor } from "./utils/waitFor";

export class AndroidProfiler implements Profiler {
  pollPerformanceMeasures = pollPerformanceMeasures;
  detectCurrentBundleId = profiler.detectCurrentBundleId;
  installProfilerOnDevice = ensureCppProfilerIsInstalled;
  getScreenRecorder = (videoPath: string) => new ScreenRecorder(videoPath);
  cleanup = cleanup;
}
