import { exec, execSync } from "child_process";

export const executeCommand = (command: string): string => {
  return execSync(command).toString();
};

export const execLoopCommand = (
  command: string,
  interval: number,
  dataCallback: { (data: string): void }
) => {
  return exec(
    `{ while true; do ${command};  sleep ${interval}; done }`
  ).stdout?.on("data", dataCallback);
};
