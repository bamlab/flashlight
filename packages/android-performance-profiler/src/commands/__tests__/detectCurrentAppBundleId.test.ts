import { detectCurrentAppBundleId } from "../detectCurrentAppBundleId";

const sampleOutput = `
mSurface=Surface(name=com.example.staging/com.example.MainActivity$_9617)/@0x993d3ae
mSurface=Surface(name=com.sec.android.app.launcher/com.sec.android.app.launcher.activities.LauncherActivity$_3088)/@0x469a915`;

const sampleOutputWithoutDollars = `
mSurface=Surface(name=com.example.staging/com.example.MainActivity)/@0x993d3ae
mSurface=Surface(name=com.sec.android.app.launcher/com.sec.android.app.launcher.activities.LauncherActivity)/@0x469a915`;

const executeCommandSpy = jest.spyOn(require("../shell"), "executeCommand");

describe("detectCurrentAppBundleId", () => {
  it("retrieves correctly bundle id and app activity when result match 'name=appId/appActivity$'", () => {
    executeCommandSpy.mockImplementation((command) => {
      expect(command).toEqual(
        "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity"
      );

      return sampleOutput;
    });

    expect(detectCurrentAppBundleId()).toEqual({
      bundleId: "com.example.staging",
      appActivity: "com.example.MainActivity",
    });
  });

  it("retrieves correctly bundle id and app activity when result match 'name=appId/appActivity)'", () => {
    executeCommandSpy.mockImplementation((command) => {
      expect(command).toEqual(
        "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity"
      );

      return sampleOutputWithoutDollars;
    });

    expect(detectCurrentAppBundleId()).toEqual({
      bundleId: "com.example.staging",
      appActivity: "com.example.MainActivity",
    });
  });

  it("throws an error in case it couldn't find them", () => {
    executeCommandSpy.mockImplementation(() => "");
    expect(detectCurrentAppBundleId).toThrowError();
  });
});
