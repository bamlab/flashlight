import { EventEmitter } from "events";
import { execLoopCommands, executeLongRunningProcess } from "../shellNext";

test("execLoopCommands", async () => {
  const results: Record<string, string>[] = [];
  const polling = execLoopCommands(
    [
      {
        id: "TOTO",
        command: "echo TOTO",
      },
      {
        id: "LONG_FILE",
        command: `echo "$(<${__dirname}/long-file.txt)"`,
      },
      { id: "YOUPI", command: `echo "YOUPI"` },
    ],
    0.2,
    (data) => results.push(data),
    false
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));

  polling?.stop();
  // Arbitrarily check the 3 first results, even though we should have 1000/(0.2 * 1000) = 5 results
  // but it's not 100% deterministic
  for (let index = 0; index < 3; index++) {
    const result = results[index];
    expect(result.TOTO).toEqual("TOTO");
    expect(result.YOUPI).toEqual("YOUPI");
    expect(result.LONG_FILE.length).toEqual(2429);
  }
});

const mockSpawn = (): { stdout: EventEmitter } => {
  const mockProcess = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.stdout = new EventEmitter();

  jest
    .spyOn(require("child_process"), "spawn")
    .mockImplementationOnce((...args) => {
      expect(args).toEqual([
        "adb",
        [
          "shell",
          "/data/local/tmp/BAMPerfProfiler",
          "pollPerformanceMeasures",
          "PID_ID",
        ],
      ]);
      return mockProcess;
    });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
