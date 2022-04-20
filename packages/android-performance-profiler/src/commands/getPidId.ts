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

  const pidIds = commandOutput.split("\n").filter(Boolean);

  if (pidIds.length > 1) {
    console.error("Multiple pidIds found, selecting the first one", pidIds);
  }

  return pidIds[0];
};
