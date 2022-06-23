import { fireEvent } from "@testing-library/dom";
import { act, waitFor } from "@testing-library/react";
import { TestUtils } from "flipper-plugin";
import * as Plugin from "..";
import { getCommand } from "android-performance-profiler/src/commands/cpu/getCpuStatsByProcess";

// See https://github.com/facebook/flipper/pull/3327
// @ts-ignore
global.electronRequire = require;
require("@testing-library/react");

jest.mock("child_process", () => {
  let firstPolling = true;
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
          case `adb shell "${getCommand("123456")}"`:
            const result = require("fs").readFileSync(
              `${__dirname}/sample-command-output-${
                firstPolling ? "1" : "2"
              }.txt`,
              "utf8"
            );
            firstPolling = false;
            return result;
          default:
            console.log(
              `adb shell "date +%s%3N && cd /proc/123456/task && ls | tr '\n' ' ' | sed 's/ /\/stat /g' | xargs cat $1"`
            );
            console.error(`Unknown command: ${command}`);
            return "";
        }
      },
    }),
  };
});

// See https://github.com/apexcharts/react-apexcharts/issues/52
jest.mock("react-apexcharts", () => "apex-charts");
jest.mock("apexcharts", () => ({ exec: jest.fn() }));

const getText = (node: ChildNode): string | null => {
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

  fireEvent.click(renderer.getByText("Auto-Detect"));
  await waitFor(() => renderer.getByText("Start Measuring"));
  fireEvent.click(renderer.getByText("Start Measuring"));

  // Wait for 2 measures
  await act(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  await waitFor(() => renderer.getByText("Threads"));
  expect(getText(renderer.baseElement as HTMLBodyElement)).toMatchSnapshot();
  expect(renderer.baseElement).toMatchSnapshot();
});
