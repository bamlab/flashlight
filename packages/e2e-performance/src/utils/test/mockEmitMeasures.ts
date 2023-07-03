/* eslint-disable @typescript-eslint/no-var-requires */
import EventEmitter from "events";
import { ChildProcess } from "child_process";

const mockSpawn = (): { stdout: EventEmitter; kill: () => void } => {
  const mockProcess = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.stdout = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockProcess.kill = jest.fn();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return mockProcess;
};

export const aTraceMock = mockSpawn();
export const perfProfilerMock = mockSpawn();

jest
  .spyOn(require("child_process"), "spawn")
  .mockImplementationOnce((...args) => {
    expect(args).toEqual(["adb", ["shell", "atrace", "-c", "view", "-t", "999"]]);
    return aTraceMock as ChildProcess;
  })
  .mockImplementationOnce((...args) => {
    expect(args).toEqual([
      "adb",
      ["shell", "/data/local/tmp/BAMPerfProfiler", "pollPerformanceMeasures", "com.example", "500"],
    ]);
    return perfProfilerMock as ChildProcess;
  });

export const emitMeasure = (measureIndex: number) => {
  const cpuOutput: string = require("fs").readFileSync(
    `${__dirname}/sample-command-output-${measureIndex === 0 ? "1" : "2"}.txt`,
    "utf8"
  );
  const aTraceOutput: string = require("fs").readFileSync(
    `${__dirname}/sample-atrace-output.txt`,
    "utf8"
  );

  perfProfilerMock.stdout.emit(
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

export const emitMeasures = () => {
  emitMeasure(0);
  emitMeasure(1);
  emitMeasure(2);
};
