import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { CpuMeasure, Measure, TestCaseIterationResult, TestCaseResult } from "@perf-profiler/types";
import { Result, Row, Thread, isRefField } from "./utils/xmlTypes";

export const writeReport = (inputFileName: string, outputFileName: string) => {
  const xml = fs.readFileSync(inputFileName, "utf8");
  const iterations: TestCaseIterationResult[] = [];
  const FAKE_RAM = 200;
  const FAKE_FPS = 60;
  const TIME_INTERVAL = 500;
  const NANOSEC_TO_MILLISEC = 1_000_000;
  const CPU_TIME_INTERVAL = 10;

  const initThreadMap = (row: Row[]): { [id: number]: string } => {
    const threadRef: { [id: number]: Thread } = {};
    row.forEach((row: Row) => {
      if (!isRefField(row.thread)) {
        threadRef[row.thread.id] = row.thread;
      }
    });
    return Object.values(threadRef).reduce((acc: { [id: number]: string }, thread) => {
      const currentThreadName = thread.fmt
        .split(" ")
        .slice(0, thread.fmt.split(" ").indexOf(""))
        .join(" ");
      const currentTid = thread.tid.value;
      const numberOfThread = Object.values(threadRef).filter((thread: Thread) => {
        return thread.fmt.includes(currentThreadName) && thread.tid.value < currentTid;
      }).length;
      acc[thread.id] =
        numberOfThread > 0 ? `${currentThreadName} (${numberOfThread})` : currentThreadName;
      return acc;
    }, {});
  };

  const getMeasures = (row: Row[]): Map<number, Map<string, number>> => {
    const sampleTimeRef: { [id: number]: number } = {};
    const threadRef: { [id: number]: string } = initThreadMap(row);
    const classifiedMeasures = row.reduce((acc: Map<number, Map<string, number>>, row: Row) => {
      const sampleTime = isRefField(row.sampleTime)
        ? sampleTimeRef[row.sampleTime.ref]
        : row.sampleTime.value / NANOSEC_TO_MILLISEC;
      if (!isRefField(row.sampleTime)) {
        sampleTimeRef[row.sampleTime.id] = sampleTime;
      }

      const threadName = isRefField(row.thread)
        ? threadRef[row.thread.ref]
        : threadRef[row.thread.id];

      const correspondingTimeInterval =
        parseInt((sampleTime / TIME_INTERVAL).toFixed(0), 10) * TIME_INTERVAL;

      const timeIntervalMap = acc.get(correspondingTimeInterval) ?? new Map<string, number>();

      const numberOfPointsIn = timeIntervalMap.get(threadName) ?? 0;

      timeIntervalMap.set(threadName, numberOfPointsIn + 1);

      acc.set(correspondingTimeInterval, timeIntervalMap);

      return acc;
    }, new Map<number, Map<string, number>>());
    return classifiedMeasures;
  };

  const options = {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    parseAttributeValue: true,
    textNodeName: "value",
    updateTag(tagName: string) {
      switch (tagName) {
        case "trace-query-result": {
          return "result";
        }
        case "sample-time": {
          return "sampleTime";
        }
        default: {
          return tagName;
        }
      }
    },
  };
  const parser = new XMLParser(options);
  const jsonObject: Result = parser.parse(xml);
  if (!jsonObject.result.node.row) {
    throw new Error("No rows in the xml file");
  }

  const measures: Map<number, Map<string, number>> = getMeasures(jsonObject.result.node.row);
  const formattedMeasures: Measure[] = Array.from(measures.entries()).map(
    (classifiedMeasures: [number, Map<string, number>]) => {
      const timeInterval = classifiedMeasures[0];
      const timeIntervalMap = classifiedMeasures[1];
      const cpuMeasure: CpuMeasure = {
        perName: {},
        perCore: {},
      };
      timeIntervalMap.forEach((value: number, key: string) => {
        cpuMeasure.perName[key] = (value * 10) / (TIME_INTERVAL / CPU_TIME_INTERVAL);
      });
      return {
        cpu: cpuMeasure,
        ram: FAKE_RAM,
        fps: FAKE_FPS,
        time: timeInterval,
      };
    }
  );

  iterations.push({
    time: formattedMeasures[formattedMeasures.length - 1].time,
    measures: formattedMeasures,
    status: "SUCCESS",
  });

  const results: TestCaseResult = {
    name: "iOS Measures",
    status: "SUCCESS",
    iterations,
    type: "IOS_EXPERIMENTAL",
    specs: {
      refreshRate: FAKE_FPS,
    },
  };

  fs.writeFileSync(outputFileName, JSON.stringify(results, null, 2));
};
