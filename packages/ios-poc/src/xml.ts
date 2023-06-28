import { parseString } from "xml2js";
import fs from "fs";

const xml = fs.readFileSync(process.argv[2], "utf8");

parseString(xml, function (err, result) {
  const rows = result["trace-query-result"].node[0].row;

  const values = [];

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

  fs.writeFileSync(process.argv[3], JSON.stringify(values, null, 2));
});

// ["trace-query-result"]["@children"][0]["node"]["@children"][1:]
