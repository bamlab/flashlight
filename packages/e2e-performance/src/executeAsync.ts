import { spawn } from "child_process";
import { Logger } from "@perf-profiler/logger";

// Running with `script` ensures we display to the terminal exactly what the original script does
// For instance, maestro clears the screen multiple times which wouldn't work without calling `script`
/**
 * Running with `script` ensures we display to the terminal exactly what the original script does
 * For instance, maestro clears the screen multiple times which wouldn't work without calling `script`
 *
 * on macOS you would run `script -q /dev/null echo "Running command"`,
 * but on Linux, you would run `script -q /dev/null -c "echo \"Running command\""`
 */
const spawnProcess = (command: string) => {
  const parts = command.split(" ");

  switch (process.platform) {
    case "darwin":
      return spawn("script", ["-q", "/dev/null", ...parts]);
    case "win32":
      return spawn(parts[0], parts.slice(1));
    default:
      return spawn("script", ["-q", "/dev/null", ...["-e", "-c", command]]);
  }
};

export const executeAsync = (command: string) => {
  const child = spawnProcess(command);

  return new Promise((resolve, reject) => {
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
        reject(
          new Error(`Error when running "${command}": exited with code ${code}`)
        );
      }
      resolve(0);
    });
  });
};
