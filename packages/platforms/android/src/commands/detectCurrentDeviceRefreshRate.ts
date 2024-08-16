import { executeCommand } from "./shell";

export const detectCurrentDeviceRefreshRate = () => {
  const command = 'adb shell dumpsys display | grep -E "mRefreshRate|DisplayDeviceInfo"';
  const commandOutput = executeCommand(command);

  //const refreshRate = commandOutput.match(/mRefreshRate=([\d.]+)/);

  // Regular expression to find the renderFrameRate
  const refreshRateMatch = commandOutput.match(/renderFrameRate\s*=\s*(\d+\.?\d*)/);
  let currentRefreshRate = 0;
  if (refreshRateMatch) {
    currentRefreshRate = parseFloat(refreshRateMatch[1]);
    console.log(`Current Refresh Rate: ${currentRefreshRate} Hz`);
  } else {
    console.log("Could not find the current refresh rate.");
  }

  // Regular expression to find all supported modes
  const modeRegex = /\{id=\d+, width=\d+, height=\d+, fps=(\d+\.?\d*), vsync=(\d+\.?\d*)/g;
  let modeMatch;
  while ((modeMatch = modeRegex.exec(commandOutput)) !== null) {
    const fps = parseFloat(modeMatch[1]);
    const vsync = parseFloat(modeMatch[2]);
    currentRefreshRate = currentRefreshRate > fps ? currentRefreshRate : fps;
    console.log(`Supported Mode: FPS = ${fps} Hz, VSync = ${vsync} Hz`);
  }
  if (!refreshRateMatch && currentRefreshRate === 0) {
    throw new Error(
      `Could not detect device refresh rate, ${
        commandOutput
          ? `output of ${command} was ${commandOutput}`
          : "do you have an Android device connected and unlocked?"
      }`
    );
  }

  return currentRefreshRate;
};
