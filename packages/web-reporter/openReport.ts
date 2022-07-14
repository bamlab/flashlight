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

const report = JSON.stringify(
  JSON.parse(fs.readFileSync(`${process.cwd()}/${process.argv[2]}`, "utf8"))
);

const jsFileContent = fs
  .readFileSync(`${__dirname}/index.e033a635.js`, "utf8")
  .replace('"INSERT_HERE"', report);

fs.writeFileSync(`${__dirname}/report.js`, jsFileContent);

const htmlFilePath = `${__dirname}/report.html`;
fs.writeFileSync(htmlFilePath, newHtmlContent);

Logger.info(`Opening report: ${htmlFilePath}`);
execSync(`open ${htmlFilePath}`);
