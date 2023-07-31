#!/usr/bin/env node

import { executeCommand } from "@perf-profiler/profiler/dist/src/commands/shell";
import fs from "fs";
import { writeReport } from "./writeReport";
import { program } from "commander";
import { execSync, exec } from "child_process";
import os from "os";

const DURATION = 10;

const tmpFiles: string[] = [];
const removeTmpFiles = () => {
  for (const tmpFile of tmpFiles) {
    fs.rmSync(tmpFile, { recursive: true });
  }
};

const getTmpFilePath = (fileName: string) => {
  const filePath = `${os.tmpdir()}/${fileName}`;
  tmpFiles.push(filePath);

  return filePath;
};

const writeTmpFile = (fileName: string, content: string): string => {
  const tmpPath = getTmpFilePath(fileName);
  fs.writeFileSync(tmpPath, content);
  return tmpPath;
};

const executeAsyncCommand = (command: string): void => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Ah, quel dommage! An error occurred: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const startRecord = (simulatorId: string, traceFile: string) => {
  executeAsyncCommand(
    `xcrun xctrace record --device ${simulatorId} --template Flashlight --attach 'fakeStore' --output ${traceFile}`
  );
};

const save = (traceFile: string, resultsFilePath: string) => {
  const xmlOutputFile = getTmpFilePath("report.xml");
  executeCommand(
    `xctrace export --input ${traceFile} --xpath '/trace-toc/run[@number="1"]/data/table[@schema="cpu-profile"]' --output ${xmlOutputFile}`
  );
  writeReport(xmlOutputFile, resultsFilePath);
};

const launchTest = ({
  testCommand,
  appId,
  simulatorId,
  resultsFilePath,
}: {
  testCommand: string;
  appId: string;
  simulatorId: string;
  resultsFilePath: string;
}) => {
  const traceFile = getTmpFilePath(`report_${new Date().getTime()}.trace`);
  const lauchAppFile = writeTmpFile(
    "./launch.yaml",
    `appId: ${appId}
---
- launchApp
`
  );
  execSync(`maestro test ${lauchAppFile} --no-ansi`, {
    stdio: "inherit",
  });
  startRecord(simulatorId, traceFile);
  execSync(`${testCommand} --no-ansi`, {
    stdio: "inherit",
  });
  execSync(`sleep ${DURATION}`);
  const stopAppFile = writeTmpFile(
    "./stop.yaml",
    `appId: ${appId}
---
- stopApp
`
  );
  execSync(`maestro test ${stopAppFile} --no-ansi`, {
    stdio: "inherit",
  });
  save(traceFile, resultsFilePath);

  removeTmpFiles();
};

program
  .command("ios-test")
  .requiredOption("--appId <appId>", "App ID (e.g. com.monapp)")
  .requiredOption(
    "--simulatorId <simulatorId>",
    "Simulator ID (e.g. 12345678-1234-1234-1234-123456789012)"
  )
  .requiredOption(
    "--testCommand <testCommand>",
    "Test command (e.g. `maestro test flow.yml`). App performance during execution of this script will be measured over several iterations."
  )
  .requiredOption(
    "--resultsFilePath <resultsFilePath>",
    "Path where the JSON of results will be written"
  )
  .summary("Generate web report from performance measures for iOS.")
  .description(
    `Generate web report from performance measures.

Examples:
flashlight ios-test --appId com.monapp --simulatorId 12345678-1234-1234-1234-123456789012 --testCommand "maestro test flow.yml" --resultsFilePath report.json
`
  )
  .action((options) => {
    launchTest(options);
  });

program.parse();
