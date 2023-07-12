import "../utils/test/mockChildProcess";
import { LogLevel, Logger } from "@perf-profiler/logger";
import { PerformanceMeasurer } from "../PerformanceMeasurer";
import { emitMeasure, perfProfilerMock } from "../utils/test/mockEmitMeasures";

Logger.setLogLevel(LogLevel.SILENT);

const loggerDebug = jest.spyOn(Logger, "debug");
const loggerError = jest.spyOn(Logger, "error");

describe("PerformanceMeasurer", () => {
  it("handles c++ errors correctly", () => {
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

    // Reset measures when pid changes
    perfProfilerMock.stderr?.emit("data", "CPP_ERROR_MAIN_PID_CLOSED 1234");
    emitMeasure(0);
    expect(measurer.measures).toHaveLength(0);

    emitMeasure(1);
    emitMeasure(2);

    expect(measurer.measures).toHaveLength(2);
  });
});
