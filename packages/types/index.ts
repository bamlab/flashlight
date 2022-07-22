export interface CpuMeasure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}

export interface Measure {
  cpu: CpuMeasure;
  ram: number;
  time: number;
}

export interface HistogramValue {
  renderingTime: number;
  frameCount: number;
}

export interface TestCaseIterationResult {
  time: number;
  measures: Measure[];
}

export interface TestCaseResult {
  name: string;
  iterations: TestCaseIterationResult[];
}

export interface AveragedTestCaseResult {
  name: string;
  iterations: TestCaseIterationResult[];
  average: TestCaseIterationResult;
  averageHighCpuUsage: { [processName: string]: number };
  reactNativeDetected: boolean;
}
