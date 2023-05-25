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
  videoInfos?: {
    path: string;
    startOffset: number;
  };
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

// Shouldn't really be here but @perf-profiler/types is imported by everyone and doesn't contain any logic
// so nice to have it here for now
export const POLLING_INTERVAL = 500;
