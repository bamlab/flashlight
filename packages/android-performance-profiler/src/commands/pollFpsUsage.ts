import { executeCommand } from "./shell";

export const pollFpsUsage = (bundleId: string) => {
  // gfxinfo is one way but we won't get polling, just a final report
  // one of the caveats is Flutter won't be supported
  // https://github.com/flutter/flutter/issues/91406

  const lines = executeCommand(`adb shell dumpsys gfxinfo ${bundleId}`).split(
    "\n"
  );

  const firstRowIndex =
    lines.findIndex((line) => line === "\tDraw\tPrepare\tProcess\tExecute") + 1;
  const lastLineIndex = lines
    .slice(firstRowIndex)
    .findIndex((line) => line === "");

  const frameTimes = lines.slice(firstRowIndex, lastLineIndex).map((line) =>
    line
      .split("\n")
      .filter(Boolean)
      .reduce((sum, currentFrameTime) => sum + parseFloat(currentFrameTime), 0)
  );
  console.log(frameTimes, frameTimes.length);
};
