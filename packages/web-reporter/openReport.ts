#!/usr/bin/env node

import { execSync } from "child_process";
import { program } from "commander";
import { Logger } from "@perf-profiler/logger";
import { writeReport } from "./writeReport";

program
  .argument("<files/folders...>")
  .description(
    `Generate web report from performance measures.

Examples:
npx @perf-profiler/web-reporter results1.json
npx @perf-profiler/web-reporter results1.json results2.json -o output-dir
npx @perf-profiler/web-reporter results1.json --skip 1500 --duration 10000
`
  )
  .option("-o, --output-dir <outputDir>", "Output directory for the web report")
  .option(
    "-d, --duration <duration>",
    'Duration in ms of measures to analyze in report. If measures are longer than that, they\'ll be "cut".'
  )
  .option("-s, --skip <skip>", "Skip first ms of measures in report");

program.parse();

const outputDir = (program.opts().outputDir as string) || __dirname;
const duration = program.opts().duration
  ? parseInt(program.opts().duration, 10)
  : null;
const skip = program.opts().skip ? parseInt(program.opts().skip, 10) : 0;

const jsonPaths = program.args;
const htmlFilePath = writeReport({
  outputDir,
  jsonPaths,
  duration,
  skip,
});

Logger.success(`Opening report: ${htmlFilePath}`);
try {
  execSync(`open ${htmlFilePath}`);
} catch {
  Logger.warn(`Failed to run "open ${htmlFilePath}"`);
}
