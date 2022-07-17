#!/usr/bin/env node

import { execSync } from "child_process";
import { Logger } from "@performance-profiler/logger";
import fs from "fs";

const newJsFile = "report.js";

const oldHtmlContent = fs.readFileSync(`${__dirname}/index.html`, "utf8");
const scriptName = oldHtmlContent.match(/src="(.*?)"/)?.[1];

const newHtmlContent = fs
  .readFileSync(`${__dirname}/index.html`, "utf8")
  .replace(`src="${scriptName}"`, `src="${newJsFile}"`)
  .replace('type="module"', "");

const paths = process.argv.slice(2);

const report = JSON.stringify(
  paths.map((path) =>
    JSON.parse(fs.readFileSync(`${process.cwd()}/${path}`, "utf8"))
  )
);

const jsFileContent = fs
  .readFileSync(`${__dirname}/${scriptName}`, "utf8")
  .replace('"INSERT_HERE"', report);

fs.writeFileSync(`${__dirname}/report.js`, jsFileContent);

const htmlFilePath = `${__dirname}/report.html`;
fs.writeFileSync(htmlFilePath, newHtmlContent);

Logger.success(`Opening report: ${htmlFilePath}`);
execSync(`open ${htmlFilePath}`);
