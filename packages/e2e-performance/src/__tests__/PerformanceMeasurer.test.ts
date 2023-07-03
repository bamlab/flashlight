import { LogLevel, Logger } from "@perf-profiler/logger";
import { PerformanceMeasurer } from "../PerformanceMeasurer";
import { emitMeasure, perfProfilerMock } from "../utils/test/mockEmitMeasures";
import "../utils/test/mockChildProcess";

Logger.setLogLevel(LogLevel.SILENT);

const loggerDebug = jest.spyOn(Logger, "debug");
const loggerError = jest.spyOn(Logger, "error");

describe("PerformanceMeasurer", () => {
  it("ignores when stat file cannot be opened since it's likely the thread is dead", () => {
    const measurer = new PerformanceMeasurer("com.example");
    measurer.start();
    emitMeasure(0);
    emitMeasure(1);
    perfProfilerMock.stderr?.emit("data", "CPP_ERROR_CANNOT_OPEN_FILE /proc/1234/tasks/578/stat");
    emitMeasure(2);

    expect(loggerDebug).toHaveBeenCalledWith(
      "CPP_ERROR_CANNOT_OPEN_FILE /proc/1234/tasks/578/stat"
    );
    expect(loggerError).not.toHaveBeenCalled();

    expect(measurer.measures).toHaveLength(2);
    expect(measurer.measures).toMatchSnapshot();
  });
});
