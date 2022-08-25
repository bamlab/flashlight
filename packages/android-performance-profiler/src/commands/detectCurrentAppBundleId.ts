import { executeCommand } from "./shell";

export const detectCurrentAppBundleId = () => {
  const command =
    "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity";

  const commandOutput = executeCommand(command);

  const regexMatching = commandOutput.match(/name=([\w.]+)\/([\w.]+)\$/);

  if (!regexMatching) {
    throw new Error(
      `Could not detect app, output of "${command}" was ${commandOutput}`
    );
  }

  const [, bundleId, appActivity] = regexMatching;

  return { bundleId, appActivity };
};
