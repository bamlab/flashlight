import { detectCurrentDeviceRefreshRate } from "../detectCurrentDeviceRefreshRate";
import fs from "fs";

const sampleOutput = fs.readFileSync(`${__dirname}/dumpsys-display.txt`, "utf-8");
const sampleOutput2 = fs.readFileSync(`${__dirname}/dumpsys-display120.txt`, "utf-8");

const executeCommandSpy = jest.spyOn(require("../shell"), "executeCommand");

describe("detectCurrentDeviceRefreshRate", () => {
  it("retrieves correctly device refresh rate of a basic 60fps device", () => {
    executeCommandSpy.mockImplementation((command) => {
      expect(command).toEqual(
        'adb shell dumpsys display | grep -E "mRefreshRate|DisplayDeviceInfo"'
      );

      return sampleOutput;
    });

    expect(detectCurrentDeviceRefreshRate()).toEqual(60);
  });

  it("retrieves correctly device refresh rate of a 120fps pixel device", () => {
    executeCommandSpy.mockImplementation((command) => {
      expect(command).toEqual(
        'adb shell dumpsys display | grep -E "mRefreshRate|DisplayDeviceInfo"'
      );

      return sampleOutput2;
    });

    expect(detectCurrentDeviceRefreshRate()).toEqual(120);
  });

  it("throws an error in case it couldn't find it", () => {
    executeCommandSpy.mockImplementation(() => "");
    expect(detectCurrentDeviceRefreshRate).toThrow();
  });
});
