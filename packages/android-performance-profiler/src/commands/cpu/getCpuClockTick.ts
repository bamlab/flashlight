import { Logger } from "@performance-profiler/logger";
import { executeCommand } from "../shell";

export const getCpuClockTick = () => {
  try {
    return parseInt(executeCommand(`adb shell getconf CLK_TCK`), 10);
  } catch (error) {
    Logger.warn("Failed to retrieve CPU clock tick, defaulting to 100");
    return 100;
  }
};
