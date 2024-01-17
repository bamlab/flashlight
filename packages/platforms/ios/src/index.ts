import { Measure, Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";
import { ChildProcess, exec } from "child_process";

interface AppMonitorData {
  Pid: number | null;
  Name: string | null;
  CPU: string | null;
  Memory: string | null;
  DiskReads: string | null;
  DiskWrites: string | null;
  Threads: number | null;
  Time: string | null;
}

interface FPSData {
  currentTime: string | null;
  fps: number | null;
}

type DataTypes = "cpu" | "fps";

export class IOSProfiler implements Profiler {
  private measures: Record<string, Measure> = {};
  private lastFPS: FPSData = { currentTime: null, fps: null };
  private lastCpu: AppMonitorData = {
    Pid: null,
    Name: null,
    CPU: null,
    Memory: null,
    DiskReads: null,
    DiskWrites: null,
    Threads: null,
    Time: null,
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

  createMeasure = (cpu: string, fps: number, time: string, ram: string) => {
    const cpuMeasure = {
      perName: { Total: parseFloat(cpu.replace(" %", "")) },
      perCore: {},
    };
    const measure: Measure = {
      cpu: cpuMeasure,
      ram: parseFloat(ram.replace(" MiB", "")),
      fps: fps,
      time: new Date(time).getTime(),
    };
    this.measures[measure.time] = measure;
    if (this.onMeasure) {
      this.onMeasure(measure);
    }
  };

  synchronizeData = () => {
    const lastCPUData = this.lastCpu.CPU;
    const lastFPSData = this.lastFPS.fps;
    const lastTimeData = this.lastCpu.Time;
    const lastRamData = this.lastCpu.Memory;
    if (lastCPUData && lastFPSData && lastTimeData && lastRamData) {
      this.createMeasure(lastCPUData, lastFPSData, lastTimeData, lastRamData);
    }
  };

  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    this.onMeasure = options.onMeasure;
    const cpuAndMemoryPolling = exec(
      `pyidevice instruments appmonitor --format=flush -b ${bundleId} --time 10`
    );

    const fpsPolling = exec(`pyidevice instruments fps --format=flush --time 100`);

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
