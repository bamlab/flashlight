#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import { program } from "commander";
import { detectCurrentAppBundleId } from "@perf-profiler/profiler";
import { PerformanceMeasurer } from "../../PerformanceMeasurer";
import { writeReport } from "../../writeReport";
import { MeasureCommandUI } from "./MeasureCommandUI";

program
  .command("measure")
  .description("")
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
  .action((options) => {
    const bundleId = options.bundleId || detectCurrentAppBundleId().bundleId;
    const performanceMeasurer = new PerformanceMeasurer(bundleId);

    const writeReportFile = async () => {
      writeReport([await performanceMeasurer.stop()], {
        path: options.resultsFilePath,
        title: options.resultsTitle,
      });
    };

    render(
      <MeasureCommandUI
        performanceMeasurer={performanceMeasurer}
        writeReportFile={writeReportFile}
      />
    );
  });

program.parse();
