import { act, fireEvent, screen } from "@testing-library/react";
import { TestUtils } from "flipper-plugin";
import { EventEmitter } from "events";
import { getText } from "@perf-profiler/web-reporter-ui/utils/getSnapshotText";
import * as Plugin from "..";

// See https://github.com/facebook/flipper/pull/3327
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.electronRequire = require;
require("@testing-library/react");

window.alert = console.error;

jest.mock("child_process", () => {
  return {
    spawn: jest.requireActual("child_process").spawn,
    execSync: (command: string) => ({
      toString: () => {
        if (
          command.startsWith("adb push") &&
          command.endsWith(
            "/BAMPerfProfiler-arm64-v8a /data/local/tmp/BAMPerfProfiler"
          )
        ) {
          return "";
        }

        switch (command) {
          case "adb shell /data/local/tmp/BAMPerfProfiler printCpuClockTick":
            return 100;
          case "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity":
            return "      mSurface=Surface(name=com.example/com.example.MainActivity$_21455)/@0x9110fea";
          case "adb shell pidof com.example":
            return "123456";
          case "adb shell /data/local/tmp/BAMPerfProfiler printRAMPageSize":
            return 4096;
          case "adb shell getprop ro.product.cpu.abi":
            return "arm64-v8a";
          case "adb shell getprop ro.build.version.sdk":
            return "30";
          case "adb shell setprop debug.hwui.profile true":
          case "adb shell atrace --async_stop 1>/dev/null":
            return "";
          default:
            console.error(`Unknown command: ${command}`);
            return "";
        }
      },
    }),
  };
});

const mockSpawn = (): { stdout: EventEmitter; kill: () => void } => {
  const mockProcess = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.stdout = new EventEmitter();

  jest
    .spyOn(require("child_process"), "spawn")
    .mockImplementationOnce((...args) => {
      expect(args).toEqual([
        "adb",
        ["shell", "atrace", "-c", "view", "-t", "999"],
      ]);
      return mockProcess;
    })
    .mockImplementationOnce((...args) => {
      expect(args).toEqual([
        "adb",
        [
          "shell",
          "/data/local/tmp/BAMPerfProfiler",
          "pollPerformanceMeasures",
          "123456",
        ],
      ]);
      return mockProcess;
    });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.kill = jest.fn();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return mockProcess;
};

const spawn = mockSpawn();

const emitMeasures = () => {
  const emitMeasure = (measureIndex: number) => {
    const cpuOutput: string = require("fs").readFileSync(
      `${__dirname}/sample-command-output-${
        measureIndex === 0 ? "1" : "2"
      }.txt`,
      "utf8"
    );
    const aTraceOutput: string = require("fs").readFileSync(
      `${__dirname}/sample-atrace-output.txt`,
      "utf8"
    );

    spawn.stdout.emit(
      "data",
      `=START MEASURE=
${cpuOutput}
=SEPARATOR=
4430198 96195 58113 3 0 398896 0
=SEPARATOR=
${aTraceOutput}
=SEPARATOR=
Timestamp: ${1651248790047 + measureIndex * 500}
ADB EXEC TIME: ${42}
=STOP MEASURE=`
    );
  };

  emitMeasure(0);
  emitMeasure(1);
  emitMeasure(2);
};

test("displays FPS data and scoring", async () => {
  const { renderer } = TestUtils.renderDevicePlugin(Plugin);

  fireEvent.click(screen.getByText("Auto-Detect"));
  await screen.findByText("Start Measuring");
  fireEvent.click(screen.getByText("Start Measuring"));

  act(() => emitMeasures());

  await screen.findByText("Threads");
  expect(getText(renderer.baseElement as HTMLBodyElement)).toMatchSnapshot();
  expect(renderer.baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByText("Stop Measuring"));
  expect(spawn.kill).toBeCalled();
});
