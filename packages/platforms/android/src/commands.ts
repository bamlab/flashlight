#!/usr/bin/env node

import { Logger } from "@perf-profiler/logger";
import { Measure } from "@perf-profiler/types";
import { program } from "commander";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { getAbi } from "./commands/getAbi";
import { AndroidProfiler } from "./commands/platforms/AndroidProfiler";

const profiler = new AndroidProfiler();

const debugCppConfig = () => {
  profiler.installProfilerOnDevice();
  Logger.success(`CPU Clock tick: ${profiler.getCpuClockTick()}`);
  Logger.success(`RAM Page size: ${profiler.getRAMPageSize()}`);
};

program.command("debugCppConfig").description("Debug CPP Config").action(debugCppConfig);

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

program
  .command("profile")
  .description("Retrieves ABI architecture of the device")
  .option(
    "--bundleId <bundleId>",
    "Bundle id for the app (e.g. com.twitter.android). Defaults to the currently focused app."
  )
  .option("--fps", "Display FPS")
  .option("--ram", "Display RAM Usage")
  .option("--threadNames <threadNames...>", "Display CPU Usage for a given threads (e.g. (mqt_js))")
  .action((options) => {
    const bundleId = options.bundleId || detectCurrentAppBundleId().bundleId;

    profiler.pollPerformanceMeasures(bundleId, {
      onMeasure: (measure: Measure) => {
        const headers: string[] = [];
        const values: (number | undefined)[] = [];

        if (options.fps) {
          headers.push("FPS");
          values.push(measure.fps);
        }

        if (options.ram) {
          headers.push("RAM");
          values.push(measure.ram);
        }

        if (options.threadNames) {
          options.threadNames.forEach((thread: string) => {
            headers.push(`CPU ${thread}`);
            values.push(measure.cpu.perName[thread]);
          });
        }

        console.log(headers.join("|"));
        console.log(values.join("|"));
      },
    });
  });

program.parse();
