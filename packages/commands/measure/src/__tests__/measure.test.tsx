import "@perf-profiler/e2e/src/utils/test/mockChildProcess";
import {
  emitMeasures,
  perfProfilerMock,
  aTraceMock,
} from "@perf-profiler/e2e/src/utils/test/mockEmitMeasures";
import { fireEvent, render as webRender, screen, waitFor, act } from "@testing-library/react";
import { render as cliRender } from "ink-testing-library";
import React from "react";
import { ServerApp } from "../server/ServerApp";
import { open } from "@perf-profiler/shell";
import { matchSnapshot } from "@perf-profiler/web-reporter-ui/utils/testUtils";
import { removeCLIColors } from "./utils/removeCLIColors";
import { LogLevel, Logger } from "@perf-profiler/logger";
import { DEFAULT_PORT } from "../server/constants";

jest.mock("@perf-profiler/shell", () => ({
  open: jest.fn(),
}));

Math.random = () => 0.5;

// Set me to LogLevel.DEBUG to see the debug logs
Logger.setLogLevel(LogLevel.SILENT);

let originalWindow: Window & typeof globalThis;
let MeasureWebApp: React.FC;

describe("flashlight measure interactive", () => {
  beforeAll(async () => {
    originalWindow = global.window;

    global.window = Object.create(window);
    Object.defineProperty(window, "__FLASHLIGHT_DATA__", {
      value: { socketServerUrl: `http://localhost:${DEFAULT_PORT}` },
      writable: true,
    });

    MeasureWebApp = (await import("../webapp/MeasureWebApp")).MeasureWebApp;
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  const expectWebAppToBeOpened = () =>
    waitFor(() => expect(open).toHaveBeenCalledWith(`http://localhost:${DEFAULT_PORT}`));

  const setupCli = (customPort = DEFAULT_PORT) => {
    const { lastFrame, unmount } = cliRender(<ServerApp port={customPort} />);
    const closeCli = async () => {
      unmount();
      // Seems like we need to wait for the useEffect cleanup to happen
      await new Promise((resolve) => setTimeout(resolve, 0));
    };

    return {
      closeCli,
      expectCliOutput: () => expect(removeCLIColors(lastFrame())),
    };
  };

  const setupWebApp = () => {
    const view = webRender(<MeasureWebApp />);

    return {
      closeWebApp: view.unmount,
      expectWebAppToMatchSnapshot: (snapshotName: string) => matchSnapshot(view, snapshotName),
    };
  };

  test("it displays measures", async () => {
    const { closeCli, expectCliOutput } = setupCli();
    const { closeWebApp, expectWebAppToMatchSnapshot } = setupWebApp();
    await expectWebAppToBeOpened();

    expectCliOutput().toMatchInlineSnapshot(`
      "
       Flashlight web app running on: http://localhost:${DEFAULT_PORT}
      "
    `);

    // Autodetect app id com.example
    await screen.findByText("Auto-Detect");
    fireEvent.click(screen.getByText("Auto-Detect"));
    await screen.findByDisplayValue("com.example");

    // Start measuring
    fireEvent.click(screen.getByText("Start Measuring"));

    // Initial report screen with no measures
    await screen.findByText("Average Test Runtime");
    expectWebAppToMatchSnapshot("Web app with no measures yet");

    // Simulate measures being emitted on the device
    act(() => emitMeasures());

    // We should now see 1000ms of measures: 3 measures at 0/500/1000ms
    await screen.findByText("1000 ms");
    // Find the score!
    screen.getByText("47");

    // expand threads
    await screen.findByText("Other threads");
    fireEvent.click(screen.getByText("Other threads"));

    expectWebAppToMatchSnapshot("Web app with measures and threads opened");

    // Stop measuring
    fireEvent.click(screen.getByText("Stop Measuring"));
    await waitFor(() => expect(aTraceMock.kill).toHaveBeenCalled());
    await waitFor(() => expect(perfProfilerMock.kill).toHaveBeenCalled());

    // Close apps

    await closeCli();
    closeWebApp();
  });

  test("it handles the --port flag correctly", async () => {
    const customPort = 1001;

    const { closeCli, expectCliOutput } = setupCli(customPort);

    const { closeWebApp } = setupWebApp();

    const expectWebAppToBeOpenedOnCustomPort = () =>
      waitFor(() => expect(open).toHaveBeenCalledWith(`http://localhost:${customPort}`));
    await expectWebAppToBeOpenedOnCustomPort();

    expectCliOutput().toMatchInlineSnapshot(`
    "
     Flashlight web app running on: http://localhost:${customPort}
    "
  `);

    // Close apps
    await closeCli();
    closeWebApp();
  });
});
