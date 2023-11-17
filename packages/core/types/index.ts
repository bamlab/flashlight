export interface CpuMeasure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}

export interface Measure {
  cpu: CpuMeasure;
  ram?: number;
  fps?: number;
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

type TestCaseResultType = "IOS_EXPERIMENTAL" | undefined;
export interface TestCaseResult {
  name: string;
  score?: number;
  status: TestCaseResultStatus;
  iterations: TestCaseIterationResult[];
  type?: TestCaseResultType;
}

export interface AveragedTestCaseResult {
  name: string;
  score?: number;
  status: TestCaseResultStatus;
  iterations: TestCaseIterationResult[];
  average: TestCaseIterationResult;
  averageHighCpuUsage: { [processName: string]: number };
  type?: TestCaseResultType;
}

// Shouldn't really be here but @perf-profiler/types is imported by everyone and doesn't contain any logic
// so nice to have it here for now
export const POLLING_INTERVAL = 500;

export const ThreadNames = {
  UI_THREAD: "UI Thread",
  JS_THREAD: "mqt_js",
};

export const ThreadNamesIOS = {
  UI_THREAD: "Main Thread",
  JS_THREAD: "com.facebook.react.JavaScript",
};

export interface ScreenRecorder {
  startRecording({ bitRate = 8000000, size }: { bitRate?: number; size?: string }): Promise<void>;
  stopRecording(): Promise<void>;
  pullRecording: (path: string) => Promise<void>;
  getRecordingStartTime: () => number;
}

export interface ProfilerPollingOptions {
  onMeasure: (measure: Measure) => void;
  onStartMeasuring?: () => void;
}

export interface Profiler {
  pollPerformanceMeasures: (
    bundleId: string,
    options: ProfilerPollingOptions
  ) => { stop: () => void };
  detectCurrentBundleId: () => string;
  installProfilerOnDevice: () => void;
  cleanup: () => void;
  getScreenRecorder: (videoPath: string) => ScreenRecorder;
}
