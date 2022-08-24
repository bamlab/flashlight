#!/usr/bin/env node

import { Logger } from "@perf-profiler/logger";
import {
  getCpuClockTick,
  getRAMPageSize,
  installCppProfiler,
} from "./commands/cppProfiler";
import { program } from "commander";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { getAbi } from "./commands/getAbi";

const debugCppConfig = () => {
  installCppProfiler();
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
    console.log(detectCurrentAppBundleId());
  });

program
  .command("getCurrentAppPid")
  .description("Retrieves the focused app process id")
  .action(() => {
    console.log(getPidId(detectCurrentAppBundleId()));
  });

program
  .command("getAbi")
  .description("Retrieves ABI architecture of the device")
  .action(() => {
    console.log(getAbi());
  });

program.parse();
