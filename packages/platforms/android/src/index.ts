import { cleanup } from "./commands/shell";
import { profiler } from "./commands/platforms/platformProfiler";
import { Profiler } from "@perf-profiler/types";
import { execSync } from "child_process";

export { Measure } from "@perf-profiler/types";
export { Measure as GfxInfoMeasure } from "./commands/gfxInfo/parseGfxInfo";
export { waitFor } from "./utils/waitFor";
export { executeAsync, executeCommand } from "./commands/shell";

export class AndroidProfiler implements Profiler {
  pollPerformanceMeasures = profiler.pollPerformanceMeasures;
  detectCurrentBundleId = profiler.detectCurrentBundleId;
  installProfilerOnDevice = profiler.installProfilerOnDevice;
  getScreenRecorder = profiler.getScreenRecorder;
  cleanup = cleanup;
  async stopApp(bundleId: string) {
    execSync(`adb shell am force-stop ${bundleId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
