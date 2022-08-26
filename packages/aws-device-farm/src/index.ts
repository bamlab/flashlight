#!/usr/bin/env node

import path from "path";
import { program } from "commander";
import { checkResults, runTest } from "./runTest";

const DEFAULT_PROJECT_NAME = "Flashlight";

program
  .command("runTest")
  .requiredOption(
    "--apkPath <apkPath>",
    "Path to the APK to be uploaded for testing"
  )
  .requiredOption(
    "--testFolder <testFolder>",
    "Path to the folder containing the tests"
  )
  .option(
    "--testSpecsPath <testSpecsPath>",
    "Path to yml config file driving the AWS Device Farm tests",
    path.join(__dirname, "..", "flashlight.yml")
  )
  .option(
    "--projectName <projectName>",
    "AWS Device Farm project name",
    DEFAULT_PROJECT_NAME
  )
  .option(
    "--testName <testName>",
    "Test name to appear on AWS Device Farm",
    "Flashlight"
  )
  .option(
    "--reportDestinationPath <reportDestinationPath>",
    "Folder where performance measures will be written",
    "."
  )
  .option(
    "--skipWaitingForResult",
    "Skip waiting for test to be done after scheduling run.",
    false
  )
  .action(async (options) => {
    // Just destructuring to have type checking on the parameters sent to runTest
    const {
      projectName,
      testSpecsPath,
      testFolder,
      apkPath,
      testName,
      reportDestinationPath,
      skipWaitingForResult,
    } = options;

    const testRunArn = await runTest({
      apkPath,
      testSpecsPath,
      testFolder,
      projectName,
      testName,
    });

    if (!skipWaitingForResult) {
      await checkResults({ testRunArn, reportDestinationPath });
    }
  });

program
  .command("checkResults")
  .option("--testRunArn <testRunArn>", "Arn of the test run to check", ".")
  .option(
    "--reportDestinationPath <reportDestinationPath>",
    "Folder where performance measures will be written",
    "."
  )
  .action((options) => {
    const { testRunArn, reportDestinationPath } = options;
    checkResults({ testRunArn, reportDestinationPath });
  });

program.parse();
