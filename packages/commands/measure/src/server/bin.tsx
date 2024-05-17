#!/usr/bin/env node

import { program } from "commander";
import { DEFAULT_PORT } from "./constants";

program
  .command("measure")
  .summary("Measure performance of an Android app")
  .description(
    `Measure performance of an Android app. Display the results live in a web app.

Main usage:
flashlight measure`
  )
  .option("-p, --port [port]", "Specify the port number for the server")
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
  .action(async (options) => {
    const port = Number(options.port) || DEFAULT_PORT;
    // measure command can be a bit slow to load since we run ink, express and socket.io, so lazy load it
    const { runServerApp } = await import("./ServerApp");
    runServerApp({
      port,
      recordOptions: {
        record: options.record,
        bitRate: options.recordBitRate,
        size: options.recordSize,
      },
    });
  });

program.parse();
