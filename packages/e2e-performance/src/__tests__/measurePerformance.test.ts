import os from "os";
import fs from "fs";
import { measurePerformance } from "..";
import { PerformancePollingMock } from "../utils/PerformancePollingMock";
import { Logger, LogLevel } from "@perf-profiler/logger";

const mockPerformancePolling = new PerformancePollingMock();

jest.mock("@perf-profiler/profiler", () => ({
  ...jest.requireActual("@perf-profiler/profiler"),
  ensureCppProfilerIsInstalled: jest.fn(),
  getPidId: jest.fn(() => 123),
  pollPerformanceMeasures: jest.fn((pid, { onMeasure, onStartMeasuring }) => {
    mockPerformancePolling.setCallback(onMeasure);
    onStartMeasuring();
  }),
}));

Logger.setLogLevel(LogLevel.SILENT);

jest.setTimeout(10000);

// Mock test time to be always 1000ms
jest.mock("perf_hooks", () => {
  let isStart = false;
  return {
    performance: {
      now: () => {
        isStart = !isStart;
        return isStart ? 0 : 1000;
      },
    },
  };
});
const runTest = jest.fn();

describe("measurePerformance", () => {
  it("adds a score if a getScore function is passed", async () => {
    const PATH = `${os.tmpdir()}/results.json`;
    const TITLE = "TITLE";

    const { writeResults } = await measurePerformance(
      "com.example",
      {
        run: runTest,
        getScore: (result) => result.iterations.length,
      },
      {
        iterationCount: 3,
        maxRetries: 3,
        recordOptions: { record: false },
        resultsFileOptions: {
          path: PATH,
          title: TITLE,
        },
      }
    );

    expect(runTest).toHaveBeenCalledTimes(3);

    writeResults();

    expect(JSON.parse(fs.readFileSync(PATH).toString())).toMatchInlineSnapshot(`
      {
        "iterations": [
          {
            "measures": [],
            "startTime": 0,
            "status": "SUCCESS",
            "time": 1000,
          },
          {
            "measures": [],
            "startTime": 0,
            "status": "SUCCESS",
            "time": 1000,
          },
          {
            "measures": [],
            "startTime": 0,
            "status": "SUCCESS",
            "time": 1000,
          },
        ],
        "name": "TITLE",
        "score": 3,
        "status": "SUCCESS",
      }
    `);
  });

  it("waits for a certain duration", async () => {
    const DURATION = 1500;
    const interval = setInterval(() => mockPerformancePolling.emit({}), 10);
    const { measures } = await measurePerformance(
      "com.example",
      { run: runTest, duration: DURATION },
      { iterationCount: 1 }
    );

    // DURATION is 1500
    // So wait to have points 0 / 500 / 1000 and 1500 so 4 measures
    expect(measures[0].measures.length).toEqual(4);

    clearInterval(interval);
  });

  it("retries tests if they fail", async () => {
    const mockFailingTest = (failureCount: number) => {
      for (let i = 0; i < failureCount; i++) {
        runTest.mockImplementationOnce(async () => {
          throw new Error("Failure");
        });
      }
    };

    const MAX_RETRIES = 2;
    mockFailingTest(2);
    await measurePerformance(
      "com.example",
      { run: runTest },
      {
        iterationCount: 3,
        maxRetries: MAX_RETRIES,
      }
    );

    mockFailingTest(3);
    await expect(
      measurePerformance(
        "com.example",
        { run: runTest },
        {
          iterationCount: 3,
          maxRetries: MAX_RETRIES,
        }
      )
    ).rejects.toThrowError("Max number of retries reached.");
  });

  it("throws an error if no measures are returned", async () => {
    runTest.mockImplementationOnce(async () => Promise.resolve());
    await expect(
      measurePerformance(
        "com.example",
        { run: runTest },
        {
          iterationCount: 0,
        }
      )
    ).rejects.toThrowError("No measure returned");
  });
});
