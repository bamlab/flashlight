#!/usr/bin/env node

import path from "path";
import { Option, program } from "commander";
import { DEFAULT_RUN_TEST_OPTIONS, runTest } from "./commands/runTest";
import { uploadApk } from "./commands/uploadApk";
import { checkResults } from "./commands/checkResults";
import { projectRepository } from "./repositories";
import { createDefaultNodeTestPackage } from "./commands/createDefaultNodeTestPackage";

program
  .command("runTest")
  .option("--apkPath <apkPath>", "Path to the APK to be uploaded for testing")
  .option(
    "--testCommand <testCommand>",
    "Test command that should be run (e.g.: `yarn jest appium`)"
  )
  .option(
    "--testFolder <testFolder>",
    "AWS requires us to upload the folder containing the tests including node_modules folder",
    DEFAULT_RUN_TEST_OPTIONS.testFolder
  )
  .option(
    "--testSpecsPath <testSpecsPath>",
    "Path to yml config file driving the AWS Device Farm tests",
    path.join(__dirname, "..", "flashlight.yml")
  )
  .option(
    "--projectName <projectName>",
    "AWS Device Farm project name",
    DEFAULT_RUN_TEST_OPTIONS.projectName
  )
  .option(
    "--testName <testName>",
    "Test name to appear on AWS Device Farm",
    DEFAULT_RUN_TEST_OPTIONS.testName
  )
  .option(
    "--reportDestinationPath <reportDestinationPath>",
    "Folder where performance measures will be written",
    DEFAULT_RUN_TEST_OPTIONS.reportDestinationPath
  )
  .option(
    "--skipWaitingForResult",
    "Skip waiting for test to be done after scheduling run.",
    false
  )
  .option(
    "--deviceName <deviceName>",
    "Device on which to run tests. A device pool with devices containing this parameter in their model name will be created",
    DEFAULT_RUN_TEST_OPTIONS.deviceName
  )
  .addOption(
    new Option(
      "--apkUploadArn <apkUploadArn>",
      "APK Upload ARN. Overrides apkPath option"
    ).env("APK_UPLOAD_ARN")
  )
  .option(
    "--testFile <testFile>",
    "Pass a test file instead. Overrides testCommand and testSpecsPath."
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
      testCommand,
      deviceName,
      apkUploadArn,
      testFile,
    } = options;

    const testRunArn = await runTest({
      apkPath,
      testSpecsPath,
      testFolder,
      projectName,
      testName,
      testCommand,
      deviceName,
      apkUploadArn,
      testFile,
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

program
  .command("uploadApk")
  .requiredOption(
    "--apkPath <apkPath>",
    "Path to the APK to be uploaded for testing"
  )
  .option(
    "--projectName <projectName>",
    "AWS Device Farm project name",
    DEFAULT_RUN_TEST_OPTIONS.projectName
  )
  .action(async (options) => {
    const { apkPath, projectName } = options;
    uploadApk({ apkPath, projectName });
  });

program
  .command("createDefaultNodeTestPackage")
  .option(
    "--projectName <projectName>",
    "AWS Device Farm project name",
    DEFAULT_RUN_TEST_OPTIONS.projectName
  )
  .action(async (options) => {
    const { projectName } = options;
    const projectArn = await projectRepository.getOrCreate({
      name: projectName,
    });
    await createDefaultNodeTestPackage({ projectArn });
  });

program.parse();
