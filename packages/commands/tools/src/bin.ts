#!/usr/bin/env node

import {
  getCpuClockTick,
  getRAMPageSize,
  ensureCppProfilerIsInstalled,
} from "./commands/cppProfiler";
import { program } from "commander";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";

program
  .command("getCurrentAppBundleId")
  .description("Retrieves the focused app bundle id")
  .action(() => {
    const { bundleId } = detectCurrentAppBundleId();
    console.log(bundleId);
  });
