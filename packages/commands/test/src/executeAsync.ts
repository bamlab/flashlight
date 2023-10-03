import { spawn } from "child_process";

export const executeAsync = (command: string) => {
  const child = spawn(command, { shell: true });

  return new Promise((resolve, reject) => {
    child.stdout.on("data", (data: ReadableStream<string>) => {
      console.log(data.toString());
    });

    child.stderr.on("data", (data: ReadableStream<string>) => {
      // Commands can choose to log diagnostic data on stderr, not necessarily errors
      // Let's just log them and not pollute with a noisy Logger.error
      console.log(data.toString());
    });

    child.on("close", (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`Error when running "${command}": exited with code ${code}`));
      }
      resolve(0);
    });
  });
};
