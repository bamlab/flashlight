#!/usr/bin/env node

import { execSync } from "child_process";
import { program } from "commander";
import { Logger } from "@perf-profiler/logger";
import { writeReport } from "./writeReport";

program
  .argument("<files/folders...>")
  .description("Generate web report from performance measures")
  .usage(
    `yarn generate-performance-web-report -o . results1.json results2.json`
  )
  .option(
    "-o, --output-dir <outputDir>",
    "Output directory for the web report"
  );

program.parse();

const outputDir = (program.opts().outputDir as string) || __dirname;
const jsonPaths = program.args;
const htmlFilePath = writeReport({
  outputDir,
  jsonPaths,
});

Logger.success(`Opening report: ${htmlFilePath}`);
execSync(`open ${htmlFilePath}`);
