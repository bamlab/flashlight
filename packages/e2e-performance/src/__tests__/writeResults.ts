import { measurePerformance } from "..";
import fs from "fs";
import * as PerformanceTester from "../PerformanceTester";
import * as writeReport from "../writeReport";
import { Logger, LogLevel } from "@perf-profiler/logger";

jest.mock("@perf-profiler/profiler", () => ({
  ...jest.requireActual("@perf-profiler/profiler"),
  ensureCppProfilerIsInstalled: jest.fn(),
}));

Logger.setLogLevel(LogLevel.SILENT);

const mockDate = () => {
  const MOCK_DATE = new Date(1686650793058);
  jest
    .spyOn(global, "Date")
    // Mocking date
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockImplementation(() => MOCK_DATE);
};

const mockPerformanceTester = () => {
  const actualPerformanceTester = jest.requireActual("../PerformanceTester").PerformanceTester;
  jest.spyOn(PerformanceTester, "PerformanceTester").mockImplementation((...args) => {
    const tester = new actualPerformanceTester(...args);

    jest.spyOn(tester, "iterate").mockResolvedValue(undefined);

    return tester;
  });
};

const runTest = jest.fn();

const runMeasures = async (resultsFileOptions?: { path?: string; title?: string }) => {
  const { writeResults } = await measurePerformance(
    "com.example",
    {
      run: runTest,
    },
    {
      resultsFileOptions,
    }
  );
  writeResults();
};

describe("writeResults", () => {
  beforeAll(() => {
    mockDate();
    mockPerformanceTester();
  });

  const writeReportSpy = jest.spyOn(writeReport, "writeReport");

  afterEach(() => {
    writeReportSpy.mockClear();
  });

  it.each([
    [
      {
        options: undefined,
        expected: {
          filePath: `${process.cwd()}/results_1686650793058.json`,
          overrideScore: undefined,
          title: "Results",
        },
      },
    ],
    [
      {
        options: {
          title: "Awesome title",
        },
        expected: {
          filePath: `${process.cwd()}/awesome_title_1686650793058.json`,
          overrideScore: undefined,
          title: "Awesome title",
        },
      },
    ],
    [
      {
        options: {
          path: "/tmp/flashlight_test.json",
          title: "Awesome title",
        },
        expected: {
          filePath: `/tmp/flashlight_test.json`,
          overrideScore: undefined,
          title: "Awesome title",
        },
      },
    ],
    [
      {
        options: {
          path: "/tmp/flashlight_test.json",
        },
        expected: {
          filePath: `/tmp/flashlight_test.json`,
          overrideScore: undefined,
          title: "Results",
        },
      },
    ],
  ])("writes results to a file", async ({ options, expected }) => {
    await runMeasures(options);
    expect(writeReportSpy).toHaveBeenCalledWith([], expected);
    fs.rmSync(expected.filePath);
  });
});
