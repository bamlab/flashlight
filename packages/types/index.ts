export interface CpuMeasure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}

export interface Measure {
  cpu: CpuMeasure;
  ram: number;
  fps: number;
  time: number;
}

export interface HistogramValue {
  renderingTime: number;
  frameCount: number;
}

export interface TestCaseIterationResult {
  time: number;
  measures: Measure[];
  videoPath?: string;
}

export interface TestCaseResult {
  name: string;
  score?: number;
  iterations: TestCaseIterationResult[];
}

export interface AveragedTestCaseResult {
  name: string;
  score?: number;
  iterations: TestCaseIterationResult[];
  average: TestCaseIterationResult;
  averageHighCpuUsage: { [processName: string]: number };
  reactNativeDetected: boolean;
}
