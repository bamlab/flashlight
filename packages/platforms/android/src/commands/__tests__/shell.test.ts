import { EventEmitter } from "events";
import { executeLongRunningProcess } from "../shell";

const mockSpawn = (): { stdout: EventEmitter } => {
  const mockProcess = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  mockProcess.stdout = new EventEmitter();

  jest.spyOn(require("child_process"), "spawn").mockImplementationOnce((...args) => {
    expect(args).toEqual([
      "adb",
      ["shell", "/data/local/tmp/BAMPerfProfiler", "pollPerformanceMeasures", "PID_ID"],
    ]);
    return mockProcess;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return mockProcess;
};

test("executeLongRunningProcess", () => {
  const onData = jest.fn();
  const mockProcess = mockSpawn();

  executeLongRunningProcess(
    "adb shell /data/local/tmp/BAMPerfProfiler pollPerformanceMeasures PID_ID",
    "DELIMITER",
    onData
  );

  mockProcess.stdout.emit(
    "data",
    `This is
measure 1
on 3 lines
DELIMITER
This is measure 2
on 2 lines
`
  );

  mockProcess.stdout.emit(
    "data",
    `Or is it on
4 lines?
`
  );

  mockProcess.stdout.emit(
    "data",
    `DELIMITER
Here is measure 3 now
DELIMITER
And measure 4
DELIMITER
And measure 5 which
`
  );
  mockProcess.stdout.emit(
    "data",
    `is on 2 lines
DELIMITER`
  );

  expect(onData).toHaveBeenCalledTimes(5);
  expect(onData).toHaveBeenNthCalledWith(
    1,
    `This is
measure 1
on 3 lines`
  );

  expect(onData).toHaveBeenNthCalledWith(
    2,
    `This is measure 2
on 2 lines
Or is it on
4 lines?`
  );

  expect(onData).toHaveBeenNthCalledWith(3, `Here is measure 3 now`);
  expect(onData).toHaveBeenNthCalledWith(4, `And measure 4`);
  expect(onData).toHaveBeenNthCalledWith(
    5,
    `And measure 5 which
is on 2 lines`
  );
});

test("executeLongRunningProcess - simple test", () => {
  const onData = jest.fn();
  const mockProcess = mockSpawn();

  const youpi = `=START MEASURE=
hello
DELIMITER`;

  executeLongRunningProcess(
    "adb shell /data/local/tmp/BAMPerfProfiler pollPerformanceMeasures PID_ID",
    "DELIMITER",
    onData
  );

  mockProcess.stdout.emit("data", youpi);
  mockProcess.stdout.emit("data", youpi);

  expect(onData).toHaveBeenCalledTimes(2);
  expect(onData).toHaveBeenCalledWith(`=START MEASURE=
hello`);
});
