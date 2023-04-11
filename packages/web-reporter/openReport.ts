#!/usr/bin/env node

import os from "os";
import { execSync } from "child_process";
import { program } from "commander";
import { Logger } from "@perf-profiler/logger";
import { writeReport } from "./writeReport";

const getOpenReportCommand = () => {
  switch (process.platform) {
    case "darwin":
      return "open";
    case "win32":
      return "start";
    default:
      return "xdg-open";
  }
};

program
  .command("report")
  .argument("<files/folders...>")
  .summary("Generate web report from performance measures.")
  .description(
    `Generate web report from performance measures.

Examples:
flashlight report results1.json
flashlight report results1.json results2.json -o output-dir
flashlight report results1.json --skip 1500 --duration 10000
`
  )
  .option("-o, --output-dir <outputDir>", "Output directory for the web report")
  .option(
    "-d, --duration <duration>",
    'Duration in ms of measures to analyze in report. If measures are longer than that, they\'ll be "cut".'
  )
  .option("-s, --skip <skip>", "Skip first ms of measures in report")
  .action((args, options) => {
    const outputDir = options.outputDir || os.tmpdir();
    const duration = options.duration ? parseInt(options.duration, 10) : null;
    const skip = options.skip ? parseInt(options.skip, 10) : 0;

    const jsonPaths = args;
    const htmlFilePath = writeReport({
      outputDir,
      jsonPaths,
      duration,
      skip,
    });

    Logger.success(`Opening report: ${htmlFilePath}`);
    try {
      execSync(`${getOpenReportCommand()} ${htmlFilePath}`);
    } catch {
      Logger.warn(`Failed to run "open ${htmlFilePath}"`);
    }
  });

program.parse();
