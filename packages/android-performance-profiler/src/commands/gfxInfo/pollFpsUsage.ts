import { Logger } from "@perf-profiler/logger";
import { executeCommand } from "../shell";

const TIME_INTERVAL = 500;

const enableFpsDebug = () => executeCommand("adb shell setprop debug.hwui.profile true");
enableFpsDebug();

export const getCommand = (bundleId: string) => `dumpsys gfxinfo ${bundleId}`;
export const processOutput = (result: string) => {
  const lines = result.split(/\r\n|\n|\r/);

  const headerIndex = lines.findIndex((line) => line === "\tDraw\tPrepare\tProcess\tExecute");
  if (headerIndex === -1) {
    Logger.warn(
      `FPS data not found, defaulting to 0, refer to https://github.com/bamlab/android-performance-profiler#getting-fps-data`
    );

    return 0;
  }

  const firstRowIndex = headerIndex + 1;
  const lastLineIndex = lines.slice(firstRowIndex).findIndex((line) => line === "") + firstRowIndex;

  const frameTimes = lines.slice(firstRowIndex, lastLineIndex).map((line) =>
    line
      .split(/\r\n|\n|\r/)
      .filter(Boolean)
      .reduce((sum, currentFrameTime) => sum + parseFloat(currentFrameTime), 0)
  );

  const renderTime = frameTimes.reduce(
    (sum, currentFrameTime) => sum + Math.max(currentFrameTime, 1000 / 60),
    0
  );
  const frameCount = frameTimes.length;

  /**
   * We could have 0 frames drawn because nothing is happening or because the UI thread is dead
   *
   * Here we choose to be optimistic about it, and say it's because the app is idle
   * and count those as 60FPS
   */
  const idleTime = Math.max(TIME_INTERVAL - renderTime, 0);
  const idleFrameCount = (idleTime * 60) / 1000;

  return ((frameCount + idleFrameCount) / (renderTime + idleTime)) * 1000;
};
