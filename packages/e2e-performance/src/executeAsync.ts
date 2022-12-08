import { spawn } from "child_process";
import { Logger } from "@perf-profiler/logger";

const isMacOs = process.platform === "darwin";

export const executeAsync = (command: string) => {
  // Running with `script` ensures we display to the terminal exactly what the original script does
  // For instance, maestro clears the screen multiple times which wouldn't work without calling `script`
  /**
   * Running with `script` ensures we display to the terminal exactly what the original script does
   * For instance, maestro clears the screen multiple times which wouldn't work without calling `script`
   *
   * on macOS you would run `script -q /dev/null echo "Running command"`,
   * but on Linux, you would run `script -q /dev/null -c "echo \"Running command\""`
   */
  const child = spawn("script", [
    "-q",
    "/dev/null",
    ...(isMacOs ? command.split(" ") : ["-e", "-c", command]),
  ]);

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
