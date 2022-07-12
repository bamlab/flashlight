export interface CpuMeasure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}

export interface Measure {
  cpu: CpuMeasure;
  ram: number;
}

export interface HistogramValue {
  renderingTime: number;
  frameCount: number;
}

export interface TestCaseIterationResult {
  time: number;
  measures: Measure[];
  gfxInfo: {
    frameCount: number;
    time: number;
    renderTime: number;
    histogram: HistogramValue[];
  };
}
