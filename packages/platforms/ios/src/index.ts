import { Measure, Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";
import { ChildProcess, exec } from "child_process";
import { killApp } from "@perf-profiler/ios-instruments";

interface AppMonitorData {
  Pid: number;
  Name: string;
  CPU: string;
  Memory: string;
  DiskReads: string;
  DiskWrites: string;
  Threads: number;
  Time: string;
}

interface FPSData {
  currentTime: string;
  fps: number;
}

type DataTypes = "cpu" | "fps";

export class IOSProfiler implements Profiler {
  private measures: Record<string, Measure> = {};
  private lastFPS: FPSData | null = null;
  private lastCpu: AppMonitorData | null = null;
  private onMeasure: ((measure: Measure) => void) | undefined;

  parseData = async (childProcess: ChildProcess, type: DataTypes) => {
    childProcess?.stdout?.on("data", (childProcess: ChildProcess) => {
      const parsedData = JSON.parse(childProcess.toString().replace(/'/g, '"'));
      if (type === "cpu") {
        (parsedData as AppMonitorData).Time = new Date().toISOString();
        this.lastCpu = parsedData;
        this.synchronizeData();
      }
      if (type === "fps") {
        this.lastFPS = parsedData as FPSData;
      }
    });
  };

  createMeasure = (lastCpu: AppMonitorData, lastFps: FPSData) => {
    const cpuMeasure = {
      perName: { Total: parseFloat(lastCpu.CPU.replace(" %", "")) },
      perCore: {},
    };
    const measure: Measure = {
      cpu: cpuMeasure,
      ram: parseFloat(lastCpu.Memory.replace(" MiB", "")),
      fps: lastFps.fps,
      time: new Date(lastCpu.Time).getTime(),
    };
    this.measures[measure.time] = measure;
    if (this.onMeasure) {
      this.onMeasure(measure);
    }
  };

  synchronizeData = () => {
    const lastCpu = this.lastCpu;
    const lastFps = this.lastFPS;
    if (lastCpu && lastFps) {
      this.createMeasure(lastCpu, lastFps);
    }
  };

  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    this.onMeasure = options.onMeasure;
    const cpuAndMemoryPolling = exec(
      `pyidevice instruments appmonitor --format=flush -b ${bundleId} --time 500`
    );

    const fpsPolling = exec(`pyidevice instruments fps --format=flush --time 500`);

    this.parseData(cpuAndMemoryPolling, "cpu");
    this.parseData(fpsPolling, "fps");

    return {
      stop: () => {
        cpuAndMemoryPolling.kill();
        fpsPolling.kill();
      },
    };
  }

  detectCurrentBundleId(): string {
    throw new Error("App Id detection is not implemented on iOS");
  }

  installProfilerOnDevice() {
    // Do we need anything here?
  }

  getScreenRecorder(): ScreenRecorder | undefined {
    return undefined;
  }

  cleanup: () => void = () => {
    // Do we need anything here?
  };

  async stopApp(bundleId: string): Promise<void> {
    killApp(bundleId);
    return new Promise<void>((resolve) => resolve());
  }

  // This is a placeholder for the method that will be implemented in the future
  detectDeviceRefreshRate() {
    return 60;
  }
}
