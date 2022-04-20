import { executeCommand } from "./shell";

export const getCpuClockTick = () => {
  try {
    return parseInt(executeCommand(`adb shell getconf CLK_TCK`), 10);
  } catch (error) {
    console.error(error);
    return 100;
  }
};
