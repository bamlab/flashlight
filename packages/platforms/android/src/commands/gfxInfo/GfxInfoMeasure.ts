import { HistogramValue } from "./parseGfxInfo";

export interface GfxInfoMeasure {
  realtime: number;
  jankyFrames: number;
  renderingTime: number;
  histogram: HistogramValue[];
}
