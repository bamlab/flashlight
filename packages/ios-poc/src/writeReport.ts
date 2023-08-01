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

  const getMeasures = (row: Row[]) => {
    const cycleRefs: { [id: number]: number } = {};
    return row.reduce((acc: Map<number, number[]>, row: Row) => {
      const sampleTime = row.sampleTime.value / 1_000_000;
      const correspondingTimeInterval = parseInt((sampleTime / TIME_INTERVAL).toFixed(0), 10);

      const cycleWeight = row.cycleWeight;

      const cpuMeasure = isRefField(cycleWeight) ? cycleRefs[cycleWeight.ref] : cycleWeight.value;

      if (!isRefField(cycleWeight)) {
        cycleRefs[cycleWeight.id] = cycleWeight.value;
      }
      if (!acc.has(correspondingTimeInterval)) {
        acc.set(correspondingTimeInterval, []);
      }
      acc.get(correspondingTimeInterval)?.push(cpuMeasure);
      return acc;
    }, new Map<number, number[]>());
  };

  const fillWithZerosBefore = (firstTimeInterval: number, measures: Measure[]) => {
    let i = 0;
    while (i < firstTimeInterval) {
      measures.unshift({
        cpu: {
          perName: {
            total: 0,
          },
          perCore: {},
        },
        ram: FAKE_RAM,
        fps: FAKE_FPS,
        time: i * TIME_INTERVAL,
      });
      i++;
    }
  };

  const options = {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    parseAttributeValue: true,
    textNodeName: "value",
    updateTag(tagName: string, jPath: string, attrs: { [x: string]: string | number }) {
      if (tagName === "trace-query-result") return "result";
      else if (tagName === "sample-time") return "sampleTime";
      else if (tagName === "cycle-weight") return "cycleWeight";
      else return tagName;
    },
  };
  const parser = new XMLParser(options);
  const jsonObject: Result = parser.parse(xml);

  const fistSampleTime: number = jsonObject.result.node.row[0].sampleTime.value / 1_000_000;
  const firstTimeInterval: number = parseInt((fistSampleTime / TIME_INTERVAL).toFixed(0), 10);

  const measures: Map<number, number[]> = getMeasures(jsonObject.result.node.row);
  const averagedMeasures: Measure[] = Array.from(measures.entries()).reduce(
    (acc: Measure[], classifiedMeasures: [number, number[]]) => {
      acc.push({
        cpu: {
          perName: {
            total:
              classifiedMeasures[1].reduce((a, b) => a + b, 0) /
              classifiedMeasures[1].length /
              10000,
          },
          perCore: {},
        },
        ram: FAKE_RAM,
        fps: FAKE_FPS,
        time: classifiedMeasures[0] * TIME_INTERVAL,
      });
      return acc;
    },
    []
  );

  fillWithZerosBefore(firstTimeInterval, averagedMeasures);

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
