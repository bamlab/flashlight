import { Logger } from "@performance-profiler/logger";
import { executeCommand } from "./shell";

export const getPidId = (bundleId: string) => {
  let commandOutput;
  const command = `adb shell pidof ${bundleId}`;
  try {
    commandOutput = executeCommand(command);
  } catch (error) {
    throw new Error(
      `Failed to find process for bundleId ${bundleId}.\n\n This command failed: ${command}`
    );
  }

  const pids = commandOutput.split("\n").filter(Boolean);

  if (pids.length > 1) {
    console.error("Multiple pids found, selecting the first one", pids);
  }

  const pid = pids[0];

  Logger.debug(`Pid ${pid} found for bundle id ${bundleId}`);

  return pid;
};
