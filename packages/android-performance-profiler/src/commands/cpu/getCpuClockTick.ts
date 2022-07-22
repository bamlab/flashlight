import { Logger } from "@perf-profiler/logger";
import { executeCommand } from "../shellNext";

export const getCpuClockTick = () => {
  try {
    return parseInt(executeCommand(`adb shell getconf CLK_TCK`), 10);
  } catch (error) {
    Logger.debug("Failed to retrieve CPU clock tick, defaulting to 100");
    return 100;
  }
};
