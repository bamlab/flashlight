import { spawn } from "child_process";
import { Logger } from "@perf-profiler/logger";

export const executeAsync = (command: string) => {
  const parts = command.split(" ");
  const child = spawn(parts[0], parts.slice(1));

  return new Promise((resolve) => {
    child.stdout.on("data", (data: ReadableStream<string>) => {
      console.log(data.toString());
    });

    child.stderr.on("data", (data: ReadableStream<string>) => {
      Logger.error(
        `Error when running "${command}": ${"\n"}${data.toString()}`
      );
    });

    child.on("close", (code: number | null) => {
      if (code !== 0) {
        throw new Error(
          `Error when running "${command}": exited with code ${code}`
        );
      } else resolve(code);
    });
  });
};
