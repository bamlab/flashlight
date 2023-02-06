#!/usr/bin/env node

import { Option, program } from "commander";
import { execSync } from "child_process";
import { measurePerformance } from ".";
import { executeAsync } from "./executeAsync";

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
}) => {
  if (beforeAllCommand) await executeAsync(beforeAllCommand);

  const { writeResults } = await measurePerformance(
    bundleId,
    {
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
    },
    iterationCount,
    maxRetries
  );

  writeResults({
    path: resultsFilePath,
    title: resultsTitle,
  });
};

program.parse();
