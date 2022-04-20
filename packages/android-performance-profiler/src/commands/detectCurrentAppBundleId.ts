import { executeCommand } from "./shell";

export const detectCurrentAppBundleId = () => {
  const commandOutput = executeCommand(
    "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity"
  );

  return commandOutput.split("name=")[1].split("/")[0];
};
