import fs from "fs";
import os from "os";
import path from "path";
import { TestCaseResult } from "@perf-profiler/types";
import { writeReport } from "../src/writeReport";

const FIXTURE = `${__dirname}/fixtures/time-profile.xml`;

describe("writeReport", () => {
  let tmpFolder: string;
  let outputFile: string;

  beforeEach(() => {
    tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), "flashlight-instruments-"));
    outputFile = path.join(tmpFolder, "results.json");
  });

  afterEach(() => {
    fs.rmSync(tmpFolder, { recursive: true, force: true });
  });

  const run = (): TestCaseResult => {
    writeReport(FIXTURE, outputFile);
    return JSON.parse(fs.readFileSync(outputFile).toString());
  };

  it("converts an xctrace time-profile export into a report", () => {
    expect(run()).toMatchSnapshot();
  });

  it("buckets samples into 500ms intervals", () => {
    // Samples at 100/110/120ms land in bucket 0, 253/260ms in 500, 760ms in 1000
    expect(run().iterations[0].measures.map((measure) => measure.time)).toEqual([0, 500, 1000]);
  });

  it("resolves threads referenced by id and distinguishes same-named threads", () => {
    const measures = run().iterations[0].measures;

    // Rows 1-3 plus the row referencing sample-time id=1 all resolve to the main thread
    expect(measures[0].cpu.perName).toEqual({ "Main Thread": 0.8 });

    // Two distinct tids share a name, so the higher tid gets a suffix
    expect(measures[1].cpu.perName).toEqual({
      "com.apple.uikit": 0.2,
      "com.apple.uikit (1)": 0.2,
    });
  });

  it("reports the last interval as the iteration time", () => {
    const result = run();
    expect(result.iterations[0].time).toBe(1000);
    expect(result.type).toBe("IOS_EXPERIMENTAL");
    expect(result.status).toBe("SUCCESS");
  });

  it("throws when the export contains no rows", () => {
    const emptyExport = path.join(tmpFolder, "empty.xml");
    fs.writeFileSync(
      emptyExport,
      '<?xml version="1.0"?>\n<trace-query-result><node/></trace-query-result>'
    );

    expect(() => writeReport(emptyExport, outputFile)).toThrow("No rows in the xml file");
  });
});
