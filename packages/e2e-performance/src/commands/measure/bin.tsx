#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import { program } from "commander";
import { detectCurrentAppBundleId } from "@perf-profiler/profiler";
import { PerformanceMeasurer } from "../../PerformanceMeasurer";
import { writeReport } from "../../writeReport";
import { MeasureCommandUI } from "./MeasureCommandUI";
import { applyLogLevelOption, logLevelOption } from "../logLevelOption";

program
  .command("measure")
  .summary("Measure performance of an Android app")
  .description(
    `Measure performance of an Android app.

Main usage:
flashlight measure
flashlight measure --bundleId com.example.app

Pressing w will write measures to a file that you can exploit with the report command`
  )
  .option(
    "--bundleId <bundleId>",
    "Bundle id for the app (e.g. com.twitter.android). Defaults to the currently focused app."
  )
  .option(
    "--resultsFilePath <resultsFilePath>",
    "Path where the JSON of results will be written"
  )
  .option(
    "--resultsTitle <resultsTitle>",
    "Result title that is displayed at the top of the report"
  )
  .addOption(logLevelOption)
  .action(
    (options: {
      bundleId?: string;
      resultsFilePath?: string;
      resultsTitle?: string;
      logLevel?: string;
    }) => {
      applyLogLevelOption(options.logLevel);
      const bundleId = options.bundleId || detectCurrentAppBundleId().bundleId;
      const performanceMeasurer = new PerformanceMeasurer(bundleId);

      const title = options.resultsTitle || "Results";
      const filePath =
        options.resultsFilePath ||
        `${process.cwd()}/${title
          .toLocaleLowerCase()
          .replace(/ /g, "_")}_${new Date().getTime()}.json`;

      const writeReportFile = async () => {
        writeReport(
          [{ ...(await performanceMeasurer.stop()), status: "SUCCESS" }],
          {
            filePath,
            title,
          }
        );
      };

      render(
        <MeasureCommandUI
          performanceMeasurer={performanceMeasurer}
          writeReportFile={writeReportFile}
        />,
        // handle it ourselves in the profiler to kill child processes
        { exitOnCtrlC: false }
      );
    }
  );

program.parse();
