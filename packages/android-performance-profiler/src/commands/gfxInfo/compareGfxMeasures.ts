import { Measure } from "./GfxInfoParser";

export const compareGfxMeasures = (
  firstMeasure: Measure,
  secondMeasure: Measure
) => {
  const totalTime = secondMeasure.realtime - firstMeasure.realtime;
  const renderTime =
    secondMeasure.renderingTime.totalRenderTime -
    firstMeasure.renderingTime.totalRenderTime;
  const frameCount =
    secondMeasure.renderingTime.totalFramesRendered -
    firstMeasure.renderingTime.totalFramesRendered;

  const idleTime = totalTime - renderTime;
  // We add frame count in idle time as if we were running at 60fps still
  const idleTimeFrameCount = (idleTime / 1000) * 60;

  return {
    frameCount: frameCount + idleTimeFrameCount,
    time: totalTime,
  };
};
