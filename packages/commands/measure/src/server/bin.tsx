#!/usr/bin/env node

import { program } from "commander";
import { ServerApp } from "./ServerApp";
import { render } from "ink";
import React from "react";
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
  .action((options) => {
    const port = Number(options.port) || DEFAULT_PORT;
    render(
      <ServerApp port={port} />,
      // handle it ourselves in the profiler to kill child processes thanks to useCleanupOnManualExit
      { exitOnCtrlC: false }
    );
  });

program.parse();
