#!/usr/bin/env node

import { execSync } from "child_process";
import { program } from "commander";
import { Logger } from "@perf-profiler/logger";
import fs from "fs";

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

const newJsFile = "report.js";

const oldHtmlContent = fs.readFileSync(`${__dirname}/index.html`, "utf8");
const scriptName = oldHtmlContent.match(/src="(.*?)"/)?.[1];

const newHtmlContent = fs
  .readFileSync(`${__dirname}/index.html`, "utf8")
  .replace(`src="${scriptName}"`, `src="${newJsFile}"`)
  .replace('type="module"', "");

const getJsonPaths = () => {
  const paths = program.args;

  return paths
    .map((path) => {
      const isDirectory = fs.lstatSync(path).isDirectory();

      if (isDirectory) {
        return fs
          .readdirSync(path)
          .filter((file) => file.endsWith(".json"))
          .map((file) => `${path}/${file}`);
      } else {
        return path;
      }
    })
    .flat();
};

const report = JSON.stringify(
  getJsonPaths().map((path) => JSON.parse(fs.readFileSync(path, "utf8")))
);

const jsFileContent = fs
  .readFileSync(`${__dirname}/${scriptName}`, "utf8")
  .replace('"INSERT_HERE"', report);

const outputDir = (program.opts().outputDir as string) || __dirname;

fs.writeFileSync(`${outputDir}/report.js`, jsFileContent);

const htmlFilePath = `${outputDir}/report.html`;
fs.writeFileSync(htmlFilePath, newHtmlContent);

Logger.success(`Opening report: ${htmlFilePath}`);
execSync(`open ${htmlFilePath}`);
