import { act, fireEvent, screen } from "@testing-library/react";
import { TestUtils } from "flipper-plugin";
import * as Plugin from "..";
import { getCommand } from "@perf-profiler/profiler/src/commands/cpu/getCpuStatsByProcess";

// See https://github.com/facebook/flipper/pull/3327
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.electronRequire = require;
require("@testing-library/react");

window.alert = console.error;

jest.mock("child_process", () => {
  return {
    execSync: (command: string) => ({
      toString: () => {
        switch (command) {
          case "adb shell getconf CLK_TCK":
            return 100;
          case "adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp|mInputMethodTarget|mSurface' | grep Activity":
            return "      mSurface=Surface(name=com.example/com.example.MainActivity$_21455)/@0x9110fea";
          case "adb shell pidof com.example":
            return "123456";
          case "adb shell getconf PAGESIZE":
            return 4096;
          default:
            console.error(`Unknown command: ${command}`);
            return "";
        }
      },
    }),
  };
});

const mockExecLoopCommandsImplementation = (
  commands: any[],
  interval: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function
) => {
  let pollingIndex = 0;

  const mockCommandResult = (command: any) => {
    switch (command.command) {
      case getCommand("123456"):
        // eslint-disable-next-line no-case-declarations
        const result = require("fs").readFileSync(
          `${__dirname}/sample-command-output-${
            pollingIndex === 0 ? "1" : "2"
          }.txt`,
          "utf8"
        );
        pollingIndex++;
        return result;
      case "cat /proc/123456/statm":
        return "4430198 96195 58113 3 0 398896 0";
      case "date +%s%3N":
        return 1651248790047 + pollingIndex * 500;
      default:
        console.error(`Unknown command: ${command.command}`);
        return "";
    }
  };

  const sendData = () => {
    callback(
      commands.reduce(
        (aggr, command) => ({
          ...aggr,
          [command.id]: mockCommandResult(command),
        }),
        {}
      )
    );
  };

  sendData();
  sendData();
  sendData();
};

// jest
//   .spyOn(
//     require("android-performance-profiler/src/commands/shellNext"),
//     "execLoopCommands"
//   )
//   // @ts-ignore
//   .mockImplementation(mockExecLoopCommandsImplementation);

let moduleToMock;
try {
  moduleToMock = require("@perf-profiler/profiler/dist/src/commands/shellNext");
} catch {
  moduleToMock = require("@perf-profiler/profiler/src/commands/shellNext");
}
jest
  .spyOn(moduleToMock, "execLoopCommands")
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  .mockImplementation(mockExecLoopCommandsImplementation);
// See https://github.com/apexcharts/react-apexcharts/issues/52
jest.mock("react-apexcharts", () => "apex-charts");
jest.mock("apexcharts", () => ({ exec: jest.fn() }));

const getText = (node: any): string | null => {
  if (node.childNodes.length > 0) {
    return (
      Array.from(node.childNodes)
        .map((child) => getText(child))
        .filter(Boolean)
        .join("\n") || null
    );
  }

  return node.textContent;
};

test("displays FPS data and scoring", async () => {
  const { renderer } = TestUtils.renderDevicePlugin(Plugin);

  fireEvent.click(screen.getByText("Auto-Detect"));
  await screen.findByText("Start Measuring");
  fireEvent.click(screen.getByText("Start Measuring"));

  // Wait for 2 measures
  await act(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  await screen.findByText("Threads");
  expect(getText(renderer.baseElement as HTMLBodyElement)).toMatchSnapshot();
  expect(renderer.baseElement).toMatchSnapshot();
});
