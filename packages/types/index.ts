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

export type TestCaseIterationStatus = "SUCCESS" | "FAILURE";

export interface TestCaseIterationResult {
  time: number;
  measures: Measure[];
  status: TestCaseIterationStatus;
  videoInfos?: {
    path: string;
    startOffset: number;
  };
  isRetriedIteration?: boolean;
}

export type TestCaseResultStatus = "SUCCESS" | "FAILURE"; // Todo: add "SUCCESS_WITH_SOME_ITERATIONS_FAILED"
export interface TestCaseResult {
  name: string;
  score?: number;
  status: TestCaseResultStatus;
  iterations: TestCaseIterationResult[];
}

export interface AveragedTestCaseResult {
  name: string;
  score?: number;
  status: TestCaseResultStatus;
  iterations: TestCaseIterationResult[];
  average: TestCaseIterationResult;
  averageHighCpuUsage: { [processName: string]: number };
  reactNativeDetected: boolean;
}

// Shouldn't really be here but @perf-profiler/types is imported by everyone and doesn't contain any logic
// so nice to have it here for now
export const POLLING_INTERVAL = 500;
