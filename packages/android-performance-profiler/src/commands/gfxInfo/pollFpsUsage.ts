import { GfxInfoParser, Measure } from "./parseGfxInfo";
import { compareGfxMeasures } from "./compareGfxMeasures";
import { detectCurrentAppBundleId } from "android-performance-profiler";
// gfxinfo is one way
// one of the caveats is Flutter won't be supported
// https://github.com/flutter/flutter/issues/91406
export const pollFpsUsage = (bundleId: string) => {
  let previousMeasure: Measure;
  setInterval(() => {
    const newMeasure = new GfxInfoParser({
      bundleId,
    }).measure();

    if (previousMeasure) {
      const { frameCount, time } = compareGfxMeasures(
        previousMeasure,
        newMeasure
      );
      console.log(
        `${frameCount} frames rendered in ${time}ms at ${
          (frameCount / time) * 1000
        } FPS`
      );
    }

    previousMeasure = newMeasure;
  }, 1000);
};

pollFpsUsage(detectCurrentAppBundleId());

/**
 * This seems wonky
 */
// const oldAttempt = (bundleId: string) => {
//   const lines = executeCommand(`adb shell dumpsys gfxinfo ${bundleId}`).split(
//     "\n"
//   );

//   const firstRowIndex =
//     lines.findIndex((line) => line === "\tDraw\tPrepare\tProcess\tExecute") + 1;
//   const lastLineIndex = lines
//     .slice(firstRowIndex)
//     .findIndex((line) => line === "");

//   const frameTimes = lines.slice(firstRowIndex, lastLineIndex).map((line) =>
//     line
//       .split("\n")
//       .filter(Boolean)
//       .reduce((sum, currentFrameTime) => sum + parseFloat(currentFrameTime), 0)
//   );
// };
