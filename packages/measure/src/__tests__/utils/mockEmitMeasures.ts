import EventEmitter from "events";

const mockSpawn = (): { stdout: EventEmitter; kill: () => void } => {
  const mockProcess = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.stdout = new EventEmitter();

  jest
    .spyOn(require("child_process"), "spawn")
    .mockImplementationOnce((...args) => {
      expect(args).toEqual([
        "adb",
        ["shell", "atrace", "-c", "view", "-t", "999"],
      ]);
      return mockProcess;
    })
    .mockImplementationOnce((...args) => {
      expect(args).toEqual([
        "adb",
        [
          "shell",
          "/data/local/tmp/BAMPerfProfiler",
          "pollPerformanceMeasures",
          "com.example",
          "500",
        ],
      ]);
      return mockProcess;
    });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.kill = jest.fn();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return mockProcess;
};

export const spawn = mockSpawn();

export const emitMeasures = () => {
  const emitMeasure = (measureIndex: number) => {
    const cpuOutput: string = require("fs").readFileSync(
      `${__dirname}/sample-command-output-${
        measureIndex === 0 ? "1" : "2"
      }.txt`,
      "utf8"
    );
    const aTraceOutput: string = require("fs").readFileSync(
      `${__dirname}/sample-atrace-output.txt`,
      "utf8"
    );

    spawn.stdout.emit(
      "data",
      `=START MEASURE=
123456
=SEPARATOR=
${cpuOutput}
=SEPARATOR=
4430198 96195 58113 3 0 398896 0
=SEPARATOR=
${aTraceOutput}
=SEPARATOR=
Timestamp: ${1651248790047 + measureIndex * 500}
ADB EXEC TIME: ${42}
=STOP MEASURE=`
    );
  };

  emitMeasure(0);
  emitMeasure(1);
  emitMeasure(2);
};
