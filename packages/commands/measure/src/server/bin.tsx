#!/usr/bin/env node

import { program } from "commander";
import { ServerApp } from "./ServerApp";
import { render } from "ink";
import React from "react";

program
  .command("measure")
  .summary("Measure performance of an Android app")
  .description(
    `Measure performance of an Android app. Display the results live in a web app.

Main usage:
flashlight measure`
  )
  .action(() => {
    render(
      <ServerApp />,
      // handle it ourselves in the profiler to kill child processes thanks to useCleanupOnManualExit
      { exitOnCtrlC: false }
    );
  });

program.parse();
