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
  // we probably don't need this but this is added by the PerformanceMeasurer
  startTime?: number;
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
  ANDROID: {
    UI: "UI Thread",
  },
  IOS: {
    UI: "Main Thread",
  },
  FLUTTER: {
    UI: "1.ui",
    RASTER: "1.raster",
    IO: "1.io",
  },
  RN: {
    JS_ANDROID: "mqt_js",
    JS_BRIDGELESS_ANDROID: "mqt_v_js",
    OLD_BRIDGE: "mqt_native_modu",
    JS_IOS: "com.facebook.react.JavaScript",
  },
};

export interface ScreenRecorder {
  startRecording({ bitRate, size }: { bitRate?: number; size?: string }): Promise<void>;
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
  getScreenRecorder: (videoPath: string) => ScreenRecorder | undefined;
  stopApp: (bundleId: string) => Promise<void>;
  detectDeviceRefreshRate: () => number;
}

export interface DeviceSpecs {
  refreshRate: number;
}
