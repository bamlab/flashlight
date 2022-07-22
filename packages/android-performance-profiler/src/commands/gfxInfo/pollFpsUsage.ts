import { GfxInfoParser, Measure } from "./parseGfxInfo";
import { compareGfxMeasures } from "./compareGfxMeasures";

// gfxinfo is one way
// one of the caveats is Flutter won't be supported
// https://github.com/flutter/flutter/issues/91406

// Unused for now
// export const pollFpsUsage = (bundleId: string) => {
//   let previousMeasure: Measure;
//   setInterval(() => {
//     const newMeasure = new GfxInfoParser({
//       bundleId,
//     }).measure();

//     if (previousMeasure) {
//       const { frameCount, time } = compareGfxMeasures(
//         previousMeasure,
//         newMeasure
//       );
//       console.log(
//         `${frameCount} frames rendered in ${time}ms at ${
//           (frameCount / time) * 1000
//         } FPS`
//       );
//     }

//     previousMeasure = newMeasure;
//   }, 1000);
// };

export const getCommand = (bundleId: string) => `dumpsys gfxinfo ${bundleId}`;
export const processOutput = (result: string) => {
  const lines = result.split("\n");

  const firstRowIndex =
    lines.findIndex((line) => line === "\tDraw\tPrepare\tProcess\tExecute") + 1;
  const lastLineIndex =
    lines.slice(firstRowIndex).findIndex((line) => line === "") + firstRowIndex;

  const frameTimes = lines.slice(firstRowIndex, lastLineIndex).map((line) =>
    line
      .split("\n")
      .filter(Boolean)
      .reduce((sum, currentFrameTime) => sum + parseFloat(currentFrameTime), 0)
  );

  const renderTime = frameTimes.reduce(
    (sum, currentFrameTime) => sum + Math.max(currentFrameTime, 1000 / 60),
    0
  );
  const frameCount = frameTimes.length;

  return (frameCount / renderTime) * 1000;
};
