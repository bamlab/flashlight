#!/usr/bin/env node

import { Option, program } from "commander";
import { execSync } from "child_process";
import { TestCase, measurePerformance } from ".";
import { executeAsync } from "./executeAsync";
import { applyLogLevelOption, logLevelOption } from "./commands/logLevelOption";

program
  .command("test")
  .summary("Run a test several times and measure performance")
  .description(
    `Run a test several times and measure performance.

Main usage:
flashlight test --bundleId <your app id> --testCommand <your test command>

Example with Maestro:
flashlight test --bundleId com.example.app --testCommand "maestro test flow.yml"
`
  )
  .requiredOption(
    "--testCommand <testCommand>",
    "Test command (e.g. `maestro test flow.yml`). App performance during execution of this script will be measured over several iterations."
  )
  .requiredOption("--bundleId <bundleId>", "Bundle id of your app")
  .addOption(
    new Option(
      "--iterationCount <iterationCount>",
      "Amount of iterations to be run. Results will be averaged."
    )
      .default(10)
      .argParser((arg) => parseInt(arg, 10))
  )
  .addOption(
    new Option(
      "--maxRetries <maxRetries>",
      "Maximum number of retries allowed over all iterations."
    )
      .default(3)
      .argParser((arg) => parseInt(arg, 10))
  )
  .addOption(
    new Option(
      "--duration <duration>",
      "Duration (in ms) is optional, but helps in getting consistent measures. Measures will be taken for this duration, regardless of test duration"
    ).argParser((arg) => parseInt(arg, 10))
  )
  .option(
    "--beforeEachCommand <beforeEachCommand>",
    "Command to be run before each test iteration"
  )
  .option(
    "--afterEachCommand <afterEachCommand>",
    "Command to be run after each test iteration"
  )
  .option(
    "--beforeAllCommand <beforeAllCommand>",
    "Command to be run before all test iterations"
  )
  .option(
    "--resultsFilePath <resultsFilePath>",
    "Path where the JSON of results will be written"
  )
  .option(
    "--resultsTitle <resultsTitle>",
    "Result title that is displayed at the top of the report"
  )
  .option(
    "--record",
    "Allows you to record a video of the test. This is useful for debugging purposes."
  )
  .option(
    "--recordBitRate <recordBitRate>",
    "Set the video bit rate, in bits per second.  Value may be specified as bits or megabits, e.g. '4000000' is equivalent to '4M'."
  )
  .option(
    "--recordSize <recordSize>",
    'Set the video size, e.g. "1280x720".  Default is the device\'s main display resolution (if supported), 1280x720 if not.  For best results, use a size supported by the AVC encoder.'
  )
  .addOption(logLevelOption)
  .action(async (options) => {
    await runTest(options);
  });

const runTest = async ({
  duration,
  iterationCount,
  maxRetries,
  beforeEachCommand,
  beforeAllCommand,
  bundleId,
  testCommand,
  resultsFilePath,
  resultsTitle,
  afterEachCommand,
  logLevel,
  record,
  recordSize,
  recordBitRate,
}: {
  duration?: number;
  iterationCount?: number;
  maxRetries?: number;
  beforeAllCommand?: string;
  beforeEachCommand?: string;
  afterEachCommand?: string;
  testCommand: string;
  bundleId: string;
  resultsFilePath?: string;
  resultsTitle?: string;
  logLevel?: string;
  record?: boolean;
  recordSize?: string;
  recordBitRate?: number;
}) => {
  applyLogLevelOption(logLevel);
  if (beforeAllCommand) await executeAsync(beforeAllCommand);

  const testCase: TestCase = {
    beforeTest: async () => {
      // This is needed in case the e2e test script actually restarts the app
      // So far this method of measuring only works if e2e test actually starts the app
      execSync(`adb shell am force-stop ${bundleId}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (beforeEachCommand) await executeAsync(beforeEachCommand);
    },
    run: async () => {
      await executeAsync(testCommand);
    },
    afterTest: async () => {
      if (afterEachCommand) await executeAsync(afterEachCommand);
    },
    duration,
  };

  const { writeResults } = await measurePerformance(bundleId, testCase, {
    iterationCount,
    maxRetries,
    recordOptions: {
      record: !!record,
      size: recordSize,
      bitRate: recordBitRate,
    },
    resultsFileOptions: {
      path: resultsFilePath,
      title: resultsTitle,
    },
  });

  writeResults();
};

program.parse();
