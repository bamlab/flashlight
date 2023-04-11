import { executeCommand } from "../shell";

export interface HistogramValue {
  renderingTime: number;
  frameCount: number;
}

interface RenderingTimeMeasures {
  totalFramesRendered: number;
  totalRenderTime: number;
}

export interface Measure {
  jankyFrames: {
    totalRendered: number;
    count: number;
  };
  renderingTime: RenderingTimeMeasures;
  realtime: number;
  histogram: HistogramValue[];
}

export class GfxInfoParser {
  private bundleId: string;

  constructor({ bundleId }: { bundleId: string }) {
    this.bundleId = bundleId;
  }

  private async resetDumpSys(): Promise<void> {
    executeCommand(`adb shell dumpsys gfxinfo ${this.bundleId} reset`);
  }

  private getGfxInfo(): string {
    return executeCommand(`adb shell dumpsys gfxinfo ${this.bundleId}`);
  }

  private parseHistogram(histogramText: string): HistogramValue[] {
    return histogramText.split(" ").map((renderTimeText) => {
      const [renderingTime, frameCount] = renderTimeText
        .split("ms=")
        .map((text) => parseInt(text, 10));
      return { renderingTime, frameCount };
    });
  }

  public static getRenderingTimeMeasures(
    histogram: HistogramValue[]
  ): RenderingTimeMeasures {
    const { totalFramesRendered, totalRenderTime } = histogram.reduce(
      (aggregator, { renderingTime, frameCount }) => ({
        totalFramesRendered: aggregator.totalFramesRendered + frameCount,
        totalRenderTime:
          aggregator.totalRenderTime + frameCount * renderingTime,
      }),
      { totalFramesRendered: 0, totalRenderTime: 0 }
    );

    return {
      totalFramesRendered,
      totalRenderTime,
    };
  }

  public measure(): Measure {
    const gfxOutput: { [name: string]: string } = this.getGfxInfo()
      .split(/\r\n|\n|\r/)
      .reduce((values, line) => {
        const [name, value, value2] = line.split(": ");

        if (name === "Uptime") {
          return {
            ...values,
            [name]: value.split(" ")[0],
            Realtime: value2,
          };
        }
        return value !== undefined ? { ...values, [name]: value } : values;
      }, {});

    const jankyFrames = {
      totalRendered: parseInt(gfxOutput["Total frames rendered"], 10),
      count: parseInt(gfxOutput["Janky frames"], 10),
    };

    const histogram = this.parseHistogram(gfxOutput["HISTOGRAM"]);

    const renderingTime = GfxInfoParser.getRenderingTimeMeasures(histogram);

    return {
      realtime: parseInt(gfxOutput["Realtime"], 10),
      jankyFrames,
      renderingTime,
      histogram,
    };
  }
}

export const parseGfxInfo = (bundleId: string) =>
  new GfxInfoParser({ bundleId }).measure();
