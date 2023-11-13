#!/usr/bin/env node

// TODO: refactor so that these functions are not in android
// eslint-disable-next-line import/no-extraneous-dependencies
import { executeAsync, executeCommand } from "@perf-profiler/android/dist/src/commands/shell";
import fs from "fs";
import { writeReport } from "./writeReport";
import { program } from "commander";
import { execSync, ChildProcess } from "child_process";
import os from "os";

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

const startRecord = (simulatorId: string, traceFile: string): ChildProcess => {
  const templateFilePath = `${__dirname}/../Flashlight.tracetemplate`;
  return executeAsync(
    `xcrun xctrace record --device ${simulatorId} --template ${templateFilePath} --attach fakeStore --output ${traceFile}`
  );
};

const save = (traceFile: string, resultsFilePath: string) => {
  const xmlOutputFile = getTmpFilePath("report.xml");
  executeCommand(
    `xctrace export --input ${traceFile} --xpath '/trace-toc/run[@number="1"]/data/table[@schema="time-profile"]' --output ${xmlOutputFile}`
  );
  writeReport(xmlOutputFile, resultsFilePath);
};

const launchTest = async ({
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
  const traceFile = `report_${new Date().getTime()}.trace`;
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
  const recordingProcess = startRecord(simulatorId, traceFile);
  await new Promise<void>((resolve) => {
    recordingProcess.stdout?.on("data", (data) => {
      if (data.toString().includes("Ctrl-C to stop")) {
        resolve();
      }
    });
  });
  execSync(`${testCommand} --no-ansi`, {
    stdio: "inherit",
  });
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
  try {
    await new Promise<void>((resolve) => {
      recordingProcess.stdout?.on("data", (data) => {
        console.log(data.toString());
        if (data.toString().includes("Output file saved as")) {
          resolve();
        }
      });
    });
  } catch (e) {
    console.log("Error while recording: ", e);
  }
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
