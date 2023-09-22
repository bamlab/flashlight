// We'll remove the flipper plugin at some point so it's ok to just import those
// from another package in the test
// eslint-disable-next-line import/no-extraneous-dependencies
import "@perf-profiler/e2e/src/utils/test/mockChildProcess";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  emitMeasures,
  aTraceMock,
  perfProfilerMock,
} from "@perf-profiler/e2e/src/utils/test/mockEmitMeasures";
import { act, fireEvent, screen } from "@testing-library/react";
import { TestUtils } from "flipper-plugin";
import * as Plugin from "..";
import { getText } from "@perf-profiler/web-reporter-ui/utils/testUtils";

// See https://github.com/facebook/flipper/pull/3327
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.electronRequire = require;
require("@testing-library/react");

// This is a dependency of flipper-common, but we hit SyntaxError: Unexpected token 'export' with jest >= 28 and uuid v < 9
jest.mock("uuid", () => ({
  v4: () => "uuid",
}));

window.alert = console.error;

Math.random = () => 0.5;

test("displays FPS data and scoring", async () => {
  const { renderer } = TestUtils.renderDevicePlugin(Plugin);

  fireEvent.click(screen.getByText("Auto-Detect"));
  await screen.findByText("Start Measuring");
  fireEvent.click(screen.getByText("Start Measuring"));

  act(() => emitMeasures());

  await screen.findByText("Threads");
  fireEvent.click(screen.getByText("Threads"));

  expect(getText(renderer.baseElement as HTMLBodyElement)).toMatchSnapshot();
  expect(renderer.baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByText("Stop Measuring"));
  expect(perfProfilerMock.kill).toBeCalled();
  expect(aTraceMock.kill).toBeCalled();
});
