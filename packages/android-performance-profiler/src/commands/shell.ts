import { Logger } from "@perf-profiler/logger";
import { execSync, spawn } from "child_process";

export const executeCommand = (command: string): string => {
  try {
    return execSync(command, { stdio: "pipe" }).toString();
  } catch (error: any) {
    Logger.debug(
      `Error while executing command "${command}": ${error.stderr.toString()}`
    );
    throw error;
  }
};

export const executeAsync = (command: string) => {
  const parts = command.split(" ");

  const process = spawn(parts[0], parts.slice(1));

  process.stdout?.on("end", () => {
    Logger.debug(`Process for ${command} ended`);
  });

  process.on("close", (code) => {
    Logger.debug(`child process exited with code ${code}`);
  });

  process.on("error", (err) => {
    Logger.error(`Process for ${command} errored with ${err}`);
  });

  return process;
};

export const executeLongRunningProcess = (
  command: string,
  delimiter: string,
  onData: (data: string) => void
) => {
  const process = executeAsync(command);
  let currentChunk = "";

  process.stdout?.on("data", (data: ReadableStream<string>) => {
    currentChunk += data.toString();

    const dataSplits = currentChunk.split(delimiter);

    dataSplits.slice(0, -1).forEach((split) => {
      onData(split.trim());
    });

    if (dataSplits.length > 0) {
      currentChunk = currentChunk.slice(
        currentChunk.length - 1 * dataSplits[dataSplits.length - 1].length
      );
    }
  });

  return {
    stop: () => {
      process.kill();
    },
  };
};
