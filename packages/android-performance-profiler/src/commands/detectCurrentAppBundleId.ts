import { executeCommand } from "./shell";

export const detectCurrentAppBundleId = () => {
  const command = "adb shell dumpsys window windows";

  const commandOutput = executeCommand(command)
    .split(/\r\n|\n|\r/)
    .filter(
      (line) =>
        // grep mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface
        line.includes("mCurrentFocus") ||
        line.includes("mFocusedApp") ||
        line.includes("mInputMethodTarget") ||
        line.includes("mSurface")
    )
    .filter((line) => line.includes("Activity"))
    .join("\n");

  const regexMatching = commandOutput.match(/name=([\w.]+)\/([\w.]+)\$?/);

  if (!regexMatching) {
    throw new Error(
      `Could not detect app, output of "${command}" was ${commandOutput}`
    );
  }

  const [, bundleId, appActivity] = regexMatching;

  return { bundleId, appActivity };
};
