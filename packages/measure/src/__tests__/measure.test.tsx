import "@perf-profiler/e2e/src/utils/test/mockChildProcess";
import { spawn, emitMeasures } from "@perf-profiler/e2e/src/utils/test/mockEmitMeasures";
import { fireEvent, render as webRender, screen, waitFor, act } from "@testing-library/react";
import { render as cliRender } from "ink-testing-library";
import { MeasureWebApp } from "../webapp/MeasureWebApp";
import React from "react";
import { ServerApp } from "../server/ServerApp";
import { open } from "@perf-profiler/shell";
import { matchSnapshot } from "@perf-profiler/web-reporter-ui/utils/testUtils";
import { removeCLIColors } from "./utils/removeCLIColors";
import { LogLevel, Logger } from "@perf-profiler/logger";

jest.mock("@perf-profiler/shell", () => ({
  open: jest.fn(),
}));

Math.random = () => 0.5;

// Set me to LogLevel.DEBUG to see the debug logs
Logger.setLogLevel(LogLevel.SILENT);

describe("flashlight measure interactive", () => {
  const expectWebAppToBeOpened = () =>
    waitFor(() => expect(open).toHaveBeenCalledWith("http://localhost:3000"));

  const setupCli = () => {
    const { lastFrame, unmount } = cliRender(<ServerApp />);
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
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const renderer = webRender(<MeasureWebApp />);

    return {
      closeWebApp: renderer.unmount,
      expectWebAppToMatchSnapshot: (snapshotName: string) => matchSnapshot(renderer, snapshotName),
    };
  };

  test("it displays measures", async () => {
    const { closeCli, expectCliOutput } = setupCli();
    const { closeWebApp, expectWebAppToMatchSnapshot } = setupWebApp();
    await expectWebAppToBeOpened();

    expectCliOutput().toMatchInlineSnapshot(`
      "
       Flashlight web app running on: http://localhost:3000
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

    // Find the score!
    await screen.findByText("48");

    // expand threads
    await screen.findByText("Threads");
    fireEvent.click(screen.getByText("Threads"));

    expectWebAppToMatchSnapshot("Web app with measures and threads opened");

    // Stop measuring
    fireEvent.click(screen.getByText("Stop Measuring"));
    await waitFor(() => expect(spawn.kill).toBeCalled());

    // Close apps

    await closeCli();
    closeWebApp();
  });
});
