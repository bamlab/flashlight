import React from "react";
import { render } from "ink-testing-library";
import { MeasureCommandUI } from "../MeasureCommandUI";
import { PerformanceMeasurer } from "../../../PerformanceMeasurer";
import { PerformancePollingMock } from "../../../utils/PerformancePollingMock";
import { waitFor } from "../../../utils/waitFor";

const writeReport = jest.fn();
jest.spyOn(process, "exit").mockImplementation(() => {
  return null as never;
});

const performanceMeasurer = new PerformanceMeasurer("com.example");

const mockPerformancePolling = new PerformancePollingMock();

jest.mock("@perf-profiler/profiler", () => ({
  ensureCppProfilerIsInstalled: jest.fn(),
  getPidId: jest.fn(() => 123),
  pollPerformanceMeasures: jest.fn((pid, cb) =>
    mockPerformancePolling.setCallback(cb)
  ),
}));

// from https://stackoverflow.com/questions/17998978/removing-colors-from-output
// Remove colors so that snapshots are not polluted
const removeColors = (str?: string) =>
  // eslint-disable-next-line no-control-regex
  str?.replace(/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]/g, "");

describe("MeasureCommandUI", () => {
  it("should render", async () => {
    const { lastFrame, rerender, stdin } = render(
      <MeasureCommandUI
        writeReportFile={writeReport}
        performanceMeasurer={performanceMeasurer}
      />
    );

    expect(lastFrame()).toMatchInlineSnapshot(`"Waiting for first measure..."`);

    await waitFor(() => mockPerformancePolling.isStarted());

    mockPerformancePolling.emit({
      fps: 60,
      ram: 100,
      cpu: {
        perName: {
          "com.example": 50,
          "(mqt_js)": 75,
        },
        perCore: {},
      },
      time: 500,
    });

    rerender(
      <MeasureCommandUI
        writeReportFile={writeReport}
        performanceMeasurer={performanceMeasurer}
      />
    );

    expect(removeColors(lastFrame())).toMatchInlineSnapshot(`
      "
      ┌──────┬─────────────────────┬──────────┐
      │ FPS  │ Total CPU Usage (%) │ RAM (MB) │
      ├──────┼─────────────────────┼──────────┤
      │ 60.0 │ 125.0               │ 100.0    │
      └──────┴─────────────────────┴──────────┘

      Press w to write measures
      Press t to show/hide threads"
    `);

    stdin.write("t");

    expect(removeColors(lastFrame())).toMatchInlineSnapshot(`
      "
      ┌──────┬─────────────────────┬──────────┐
      │ FPS  │ Total CPU Usage (%) │ RAM (MB) │
      ├──────┼─────────────────────┼──────────┤
      │ 60.0 │ 125.0               │ 100.0    │
      └──────┴─────────────────────┴──────────┘
      ┌─────────────┬───────────────┐
      │ Thread name │ CPU Usage (%) │
      ├─────────────┼───────────────┤
      │ mqt_js      │ 75.0          │
      ├─────────────┼───────────────┤
      │ com.example │ 50.0          │
      └─────────────┴───────────────┘

      Press w to write measures
      Press t to show/hide threads"
    `);

    stdin.write("w");
    expect(writeReport).toHaveBeenCalled();
  });
});
