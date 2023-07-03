import { Logger } from "@perf-profiler/logger";
import { execSync, spawn, ChildProcess } from "child_process";

export const executeCommand = (command: string): string => {
  try {
    return execSync(command, { stdio: "pipe" }).toString();
  } catch (error: any) {
    Logger.debug(`Error while executing command "${command}": ${error.stderr.toString()}`);
    throw error;
  }
};

const childProcesses: ChildProcess[] = [];

export const cleanup = () => {
  childProcesses.forEach((child) => {
    child.kill();
  });
};

const exit = () => {
  cleanup();
  process.exit();
};

declare const global: {
  Flipper: unknown;
};

if (!global.Flipper) {
  process.on("SIGINT", exit); // CTRL+C
  process.on("SIGQUIT", exit); // Keyboard quit
  process.on("SIGTERM", exit); // `kill` command
}

class AsyncExecutionError extends Error {}

export const executeAsync = (
  command: string,
  { logStderr } = {
    logStderr: true,
  }
): ChildProcess => {
  const parts = command.split(" ");

  const childProcess = spawn(parts[0], parts.slice(1));

  childProcess.stdout?.on("end", () => {
    Logger.debug(`Process for ${command} ended`);
  });

  childProcess.stderr?.on("data", (data) => {
    if (logStderr) Logger.error(`Process for ${command} errored with ${data.toString()}`);
  });

  childProcess.on("close", (code) => {
    Logger.debug(`child process exited with code ${code}`);

    if (code) {
      throw new AsyncExecutionError(`Process for ${command} exited with code ${code}`);
    }
  });

  childProcess.on("error", (err) => {
    Logger.error(`Process for ${command} errored with ${err}`);
  });

  childProcesses.push(childProcess);

  return childProcess;
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
