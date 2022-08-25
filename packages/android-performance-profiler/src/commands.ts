#!/usr/bin/env node

import { Logger } from "@perf-profiler/logger";
import {
  getCpuClockTick,
  getRAMPageSize,
  ensureCppProfilerIsInstalled,
} from "./commands/cppProfiler";
import { program } from "commander";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { getAbi } from "./commands/getAbi";

const debugCppConfig = () => {
  ensureCppProfilerIsInstalled();
  Logger.success(`CPU Clock tick: ${getCpuClockTick()}`);
  Logger.success(`RAM Page size: ${getRAMPageSize()}`);
};

program
  .command("debugCppConfig")
  .description("Debug CPP Config")
  .action(debugCppConfig);

program
  .command("getCurrentAppBundleId")
  .description("Retrieves the focused app bundle id")
  .action(() => {
    const { bundleId } = detectCurrentAppBundleId();
    console.log(bundleId);
  });

program
  .command("getCurrentAppPid")
  .description("Retrieves the focused app process id")
  .action(() => {
    const { bundleId } = detectCurrentAppBundleId();
    console.log(getPidId(bundleId));
  });

program
  .command("getCurrentApp")
  .description("Prints out bundle id and currently focused app activity")
  .action(() => {
    const { bundleId, appActivity } = detectCurrentAppBundleId();
    console.log(`bundleId=${bundleId}\nappActivity=${appActivity}`);
  });

program
  .command("getAbi")
  .description("Retrieves ABI architecture of the device")
  .action(() => {
    console.log(getAbi());
  });

program.parse();
