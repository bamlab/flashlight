import { Measure, Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";
import { ChildProcess, exec } from "child_process";

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
  private lastFPS: FPSData = { currentTime: "", fps: 0 };
  private lastCpu: AppMonitorData = {
    Pid: 0,
    Name: "",
    CPU: "",
    Memory: "",
    DiskReads: "",
    DiskWrites: "",
    Threads: 0,
    Time: "",
  };
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

  synchronizeData = () => {
    const cpuMeasure = {
      perName: { total: parseFloat(this.lastCpu.CPU.replace(" %", "")) },
      perCore: {},
    };
    const measure: Measure = {
      cpu: cpuMeasure,
      ram: parseFloat(this.lastCpu.Memory.replace(" MiB", "")),
      fps: this.lastFPS.fps,
      time: new Date(this.lastCpu.Time).getTime(),
    };
    this.measures[measure.time] = measure;
    if (this.onMeasure) {
      this.onMeasure(measure);
    }
  };

  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    this.onMeasure = options.onMeasure;
    const cpuAndMemoryPolling = exec(
      `pyidevice instruments appmonitor --format=flush -b ${bundleId}`
    );

    const fpsPolling = exec(`pyidevice instruments fps --format=flush`);

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

  getScreenRecorder(videoPath: string): ScreenRecorder | undefined {
    return undefined;
  }

  cleanup: () => void = () => {
    // Do we need anything here?
  };
}
