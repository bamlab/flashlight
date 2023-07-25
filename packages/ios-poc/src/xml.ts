import { parseString } from "xml2js";
import fs from "fs";
import { IOSTestCaseResult } from "@perf-profiler/types";

export const toXml = (inputFileName: string, outputFileName: string) => {
  const xml = fs.readFileSync(inputFileName, "utf8");

  parseString(xml, function (err, result) {
    const rows = result["trace-query-result"].node[0].row;

    const values: [number, number][] = [];

    const cycleRefs: { [id: string]: number } = {};

    for (const row of rows) {
      const sampleTimes = row["sample-time"];

      if (sampleTimes.length > 1) throw new Error("UNEXPECTED");

      const sampleTime = parseInt(row["sample-time"][0]["_"], 10);

      const cycleWeights = row["cycle-weight"];

      if (cycleWeights.length > 1) throw new Error("UNEXPECTED");

      const cycleWeight = cycleWeights[0]["_"];

      if (cycleWeight) {
        values.push([sampleTime, parseInt(cycleWeight, 10)]);
      } else {
        values.push([sampleTime, cycleRefs[cycleWeights[0].$.ref]]);

        if (!cycleRefs[cycleWeights[0].$.ref]) throw new Error("OHOHO");
      }

      if (cycleWeights[0].$.id) {
        cycleRefs[cycleWeights[0].$.id] = parseInt(cycleWeight, 10);
      }
    }

    const results: IOSTestCaseResult = {
      measures: values,
      type: "IOS_EXPERIMENTAL",
    };

    fs.writeFileSync(outputFileName, JSON.stringify(results, null, 2));
  });
};

// ["trace-query-result"]["@children"][0]["node"]["@children"][1:]
