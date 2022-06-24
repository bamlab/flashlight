import { GfxInfoParser, HistogramValue, Measure } from "./parseGfxInfo";

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

  const histogram = secondMeasure.histogram.reduce<HistogramValue[]>(
    (aggr, value, currentIndex) =>
      aggr.concat([
        {
          ...value,
          frameCount:
            value.frameCount - firstMeasure.histogram[currentIndex].frameCount,
        },
      ]),
    []
  );
  const totalFrameTime = GfxInfoParser.getRenderingTimeMeasures(
    histogram.map((value) => ({
      ...value,
      // Using 16ms as a min value for each frame
      renderingTime: value.renderingTime > 16 ? value.renderingTime : 1000 / 60,
    }))
  ).totalRenderTime;

  const idleTime = totalTime - totalFrameTime;
  // We add frame count in idle time as if we were running at 60fps still
  const idleTimeFrameCount = (idleTime / 1000) * 60;

  return {
    frameCount: frameCount + idleTimeFrameCount,
    time: totalTime,
    renderTime,
    histogram,
  };
};
