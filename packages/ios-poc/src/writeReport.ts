import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { Measure, TestCaseIterationResult, TestCaseResult } from "@perf-profiler/types";
import { Result, Row, isRefField } from "./utils/xmlTypes";

export const writeReport = (inputFileName: string, outputFileName: string) => {
  const xml = fs.readFileSync(inputFileName, "utf8");
  const iterations: TestCaseIterationResult[] = [];
  const FAKE_RAM = 200;
  const FAKE_FPS = 60;
  const TIME_INTERVAL = 500;
  const NANOSEC_TO_MILLISEC = 1_000_000;
  const CPU_TIME_INTERVAL = 10;
  let lastSampleTimeInterval = 0;

  const getMeasures = (row: Row[]) => {
    const sampleTimeRef: { [id: number]: number } = {};
    const classifiedMeasures = row.reduce((acc: Map<number, number>, row: Row) => {
      const sampleTime = isRefField(row.sampleTime)
        ? sampleTimeRef[row.sampleTime.ref]
        : row.sampleTime.value / NANOSEC_TO_MILLISEC;
      if (!isRefField(row.sampleTime)) {
        sampleTimeRef[row.sampleTime.id] = sampleTime;
      }

      const correspondingTimeInterval = parseInt((sampleTime / TIME_INTERVAL).toFixed(0), 10);
      lastSampleTimeInterval =
        correspondingTimeInterval > lastSampleTimeInterval
          ? correspondingTimeInterval
          : lastSampleTimeInterval;
      const numberOfPointsIn = acc.get(correspondingTimeInterval) ?? 0;
      acc.set(correspondingTimeInterval, numberOfPointsIn + 1);
      return acc;
    }, new Map<number, number>());
    return fillWithZeros(lastSampleTimeInterval, classifiedMeasures);
  };

  const fillWithZeros = (
    lastSampleTimeInterval: number,
    measures: Map<number, number>
  ): Map<number, number> => {
    const updatedMeasures = new Map<number, number>();
    let i = 0;
    while (i < lastSampleTimeInterval) {
      const valueToSet = measures.get(i) ?? 0;
      updatedMeasures.set(i, valueToSet);
      i++;
    }
    return updatedMeasures;
  };

  const options = {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    parseAttributeValue: true,
    textNodeName: "value",
    updateTag(tagName: string, jPath: string, attrs: { [x: string]: string | number }) {
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

  const measures: Map<number, number> = getMeasures(jsonObject.result.node.row);
  const averagedMeasures: Measure[] = Array.from(measures.entries()).reduce(
    (acc: Measure[], classifiedMeasures: [number, number]) => {
      acc.push({
        cpu: {
          perName: {
            total: (classifiedMeasures[1] * 10) / (TIME_INTERVAL / CPU_TIME_INTERVAL),
          },
          perCore: {},
        },
        ram: FAKE_RAM,
        fps: FAKE_FPS,
        time: classifiedMeasures[0],
      });
      return acc;
    },
    []
  );

  iterations.push({
    time: averagedMeasures[averagedMeasures.length - 1].time,
    measures: averagedMeasures,
    status: "SUCCESS",
  });

  const results: TestCaseResult = {
    name: "iOS Measures",
    status: "SUCCESS",
    iterations: iterations,
    type: "IOS_EXPERIMENTAL",
  };

  fs.writeFileSync(outputFileName, JSON.stringify(results, null, 2));
};
