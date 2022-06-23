import { executeCommand } from "../shell";

interface HistogramValue {
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
}

export class GfxInfoParser {
  private androidPackage: string;

  constructor({ androidPackage }: { androidPackage: string }) {
    this.androidPackage = androidPackage;
  }

  private async resetDumpSys(): Promise<void> {
    executeCommand(`adb shell dumpsys gfxinfo ${this.androidPackage} reset`);
  }

  private getGfxInfo(): string {
    return executeCommand(`adb shell dumpsys gfxinfo ${this.androidPackage}`);
  }

  private parseHistogram(histogramText: string): HistogramValue[] {
    return histogramText.split(" ").map((renderTimeText) => {
      const [renderingTime, frameCount] = renderTimeText
        .split("ms=")
        .map((text) => parseInt(text, 10));
      return { renderingTime, frameCount };
    });
  }

  private getRenderingTimeMeasures(
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
      .split("\n")
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

    const renderingTime = this.getRenderingTimeMeasures(
      this.parseHistogram(gfxOutput["HISTOGRAM"])
    );

    return {
      realtime: parseInt(gfxOutput["Realtime"], 10),
      jankyFrames,
      renderingTime,
    };
  }
}
