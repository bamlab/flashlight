#!/usr/bin/env node

import { program } from "commander";
import { processVideoFile } from "@perf-profiler/shell";
import { detectCurrentAppBundleId } from "@perf-profiler/profiler";

const toolsCommand = program.command("tools").description("Utility tools related to Flashlight");

toolsCommand
  .command("android_get_bundle_id")
  .description("Retrieves the focused app bundle id")
  .action(() => {
    console.log(detectCurrentAppBundleId().bundleId);
  });

toolsCommand
  .command("video_fix_metadata <videoFilePath>")
  .description(
    "When coming from AWS Device Farm or certain devices, it seems the video from flashlight test is not encoded properly"
  )
  .action((options) => {
    processVideoFile(options.video_file_path, "destinationPath");
  });
