import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { pollPerformanceMeasures } from "./commands/pollPerformanceMeasures";
import { parseGfxInfo } from "./commands/gfxInfo/parseGfxInfo";
import { compareGfxMeasures } from "./commands/gfxInfo/compareGfxMeasures";
import { ensureCppProfilerIsInstalled } from "./commands/cppProfiler";
import { profiler } from "./commands/platforms/platformProfiler";
import { cleanup } from "./commands/shell";
import { ScreenRecorder } from "./commands/ScreenRecorder";

export { Measure } from "@perf-profiler/types";
export { Measure as GfxInfoMeasure } from "./commands/gfxInfo/parseGfxInfo";
export { waitFor } from "./utils/waitFor";

export {
  cleanup,
  ensureCppProfilerIsInstalled,
  compareGfxMeasures,
  detectCurrentAppBundleId,
  getPidId,
  pollPerformanceMeasures,
  parseGfxInfo,
  ScreenRecorder,
  profiler,
};
