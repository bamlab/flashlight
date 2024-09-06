import { executeCommand } from "./shell";
import { Logger } from "@perf-profiler/logger";

function deviceRefreshRateManager() {
  let refreshRate = 60; // Default to 60 fps

  return {
    getRefreshRate: () => refreshRate,
    setRefreshRate: () => {
      try {
        refreshRate = detectCurrentDeviceRefreshRate();
      } catch (e) {
        console.error(e);
      }
    },
  };
}

export const detectCurrentDeviceRefreshRate = () => {
  const command = 'adb shell dumpsys display | grep -E "mRefreshRate|DisplayDeviceInfo"';
  const commandOutput = executeCommand(command);

  const renderFrameRateMatch = commandOutput.match(/renderFrameRate\s+(\d+\.?\d*)/);

  if (renderFrameRateMatch) {
    Logger.debug(`Detected device refresh rate: ${renderFrameRateMatch[1]} Hz`);
    return Math.floor(parseFloat(renderFrameRateMatch[1]));
  }

  const matches = commandOutput.matchAll(/fps=(\d+\.?\d*)/g);
  const refreshRates = Array.from(matches, (match) => parseFloat(match[1]));
  refreshRates.sort((a, b) => b - a);

  if (refreshRates.length === 0) {
    throw new Error(
      `Could not detect device refresh rate, ${
        commandOutput
          ? `output of ${command} was ${commandOutput}`
          : "do you have an Android device connected and unlocked?"
      }`
    );
  }

  Logger.debug(`Detected device refresh rate: ${refreshRates[0]} Hz`);

  return Math.floor(refreshRates[0]);
};

const refreshRateManager = deviceRefreshRateManager();
refreshRateManager.setRefreshRate();

export { refreshRateManager };
