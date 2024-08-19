import fs from "fs";
import os from "os";
import { Logger } from "@perf-profiler/logger";
import {
  canIgnoreAwsTerminationError,
  cleanup,
  executeCommand,
  executeLongRunningProcess,
} from "../shell";
import {
  Measure,
  POLLING_INTERVAL,
  Profiler,
  ScreenRecorder,
  ThreadNames,
} from "@perf-profiler/types";
import { CpuMeasureAggregator } from "../cpu/CpuMeasureAggregator";
import { FrameTimeParser } from "../atrace/pollFpsUsage";
import { CppPerformanceMeasure, parseCppMeasure } from "../cppProfiler";
import { processOutput } from "../cpu/getCpuStatsByProcess";
import { processOutput as processRamOutput } from "../ram/pollRamUsage";

export const CppProfilerName = `BAMPerfProfiler`;

const defaultBinaryFolder = `${__dirname}/../../..${__dirname.includes("dist") ? "/.." : ""}/cpp-profiler/bin`;
// Allow overriding the binary folder with an environment variable
const binaryFolder = process.env.FLASHLIGHT_BINARY_PATH || defaultBinaryFolder;

export abstract class UnixProfiler implements Profiler {
  stop(): void {
    throw new Error("Method not implemented.");
  }
  private hasInstalledProfiler = false;
  private cpuClockTick: number | undefined;
  private RAMPageSize: number | undefined;

  /**
   * Main setup function for the cpp profiler
   *
   * It will:
   * - install the C++ profiler for the correct architecture on the device
   * - Starts the atrace process (the c++ profiler will then starts another thread to read from it)
   * - Populate needed values like CPU clock tick and RAM page size
   *
   * This needs to be done before measures and can take a few seconds
   */
  public installProfilerOnDevice(): void {
    if (!this.hasInstalledProfiler) {
      this.assertSupported();
      this.installCppProfilerOnDevice();
      this.retrieveCpuClockTick();
      this.retrieveRAMPageSize();
    }
    this.hasInstalledProfiler = true;
  }

  private retrieveCpuClockTick() {
    this.cpuClockTick = parseInt(
      executeCommand(this.getDeviceCommand(`${this.getDeviceProfilerPath()} printCpuClockTick`)),
      10
    );
  }

  private retrieveRAMPageSize() {
    this.RAMPageSize = parseInt(
      executeCommand(this.getDeviceCommand(`${this.getDeviceProfilerPath()} printRAMPageSize`)),
      10
    );
  }

  getCpuClockTick(): number {
    this.installProfilerOnDevice();
    if (!this.cpuClockTick) {
      throw new Error("CPU clock tick not initialized");
    }
    return this.cpuClockTick;
  }

  getRAMPageSize(): number {
    this.installProfilerOnDevice();
    if (!this.RAMPageSize) {
      throw new Error("RAM Page size not initialized");
    }
    return this.RAMPageSize;
  }

  private installCppProfilerOnDevice(): void {
    const abi = this.getAbi();
    Logger.info(`Installing C++ profiler for ${abi} architecture`);

    const binaryPath = `${binaryFolder}/${CppProfilerName}-${abi}`;
    const binaryTmpPath = `${os.tmpdir()}/flashlight-${CppProfilerName}-${abi}`;

    // When running from standalone executable, we need to copy the binary to an actual file
    fs.copyFileSync(binaryPath, binaryTmpPath);

    this.pushExecutable(binaryTmpPath);
    Logger.success(`C++ Profiler installed in ${this.getDeviceProfilerPath()}`);
  }

  pollPerformanceMeasures(
    bundleId: string,
    {
      onMeasure,
      onStartMeasuring = () => {
        // noop by default
      },
    }: {
      onMeasure: (measure: Measure) => void;
      onStartMeasuring?: () => void;
    }
  ) {
    let initialTime: number | null = null;
    let previousTime: number | null = null;

    let cpuMeasuresAggregator = new CpuMeasureAggregator(this.getCpuClockTick());
    let frameTimeParser = new FrameTimeParser();

    const reset = () => {
      initialTime = null;
      previousTime = null;
      cpuMeasuresAggregator = new CpuMeasureAggregator(this.getCpuClockTick());
      frameTimeParser = new FrameTimeParser();
    };

    return this.pollPerformanceMeasuresWeirdSubfunction(
      bundleId,
      ({ pid, cpu, ram: ramStr, atrace, timestamp }) => {
        if (!atrace) {
          Logger.debug("NO ATRACE OUTPUT, if the app is idle, that is normal");
        }
        const subProcessesStats = processOutput(cpu, pid);

        const ram = processRamOutput(ramStr, this.getRAMPageSize());

        let output;
        try {
          output = frameTimeParser.getFrameTimes(atrace, pid);
        } catch (e) {
          console.error(e);
        }

        if (!output) {
          return;
        }

        const { frameTimes, interval: atraceInterval } = output;

        if (!initialTime) {
          initialTime = timestamp;
        }

        if (previousTime) {
          const interval = timestamp - previousTime;

          const cpuMeasures = cpuMeasuresAggregator.process(subProcessesStats, interval);

          const fps = FrameTimeParser.getFps(
            frameTimes,
            atraceInterval,
            Math.max(
              cpuMeasures.perName[ThreadNames.ANDROID.UI] || 0,
              // Hack for Flutter apps - if this thread is heavy app will be laggy
              cpuMeasures.perName[ThreadNames.FLUTTER.UI] || 0
            )
          );

          onMeasure(
            this.supportFPS()
              ? {
                  cpu: cpuMeasures,
                  fps,
                  ram,
                  time: timestamp - initialTime,
                }
              : {
                  cpu: cpuMeasures,
                  ram,
                  time: timestamp - initialTime,
                }
          );
        } else {
          onStartMeasuring();
          cpuMeasuresAggregator.initStats(subProcessesStats);
        }
        previousTime = timestamp;
      },
      () => {
        Logger.warn("Process id has changed, ignoring measures until now");
        reset();
      }
    );
  }

  pollPerformanceMeasuresWeirdSubfunction = (
    pid: string,
    onData: (measure: CppPerformanceMeasure) => void,
    onPidChanged?: (pid: string) => void
  ) => {
    this.installProfilerOnDevice();

    const DELIMITER = "=STOP MEASURE=";

    const process = executeLongRunningProcess(
      this.getDeviceCommand(
        `${this.getDeviceProfilerPath()} pollPerformanceMeasures ${pid} ${POLLING_INTERVAL}`
      ),
      DELIMITER,
      (data: string) => {
        onData(parseCppMeasure(data));
      }
    );

    process.stderr?.on("data", (data) => {
      const log = data.toString();

      // Ignore errors, it might be that the thread is dead and we can't read stats anymore
      if (log.includes("CPP_ERROR_CANNOT_OPEN_FILE")) {
        Logger.debug(log);
      } else if (log.includes("CPP_ERROR_MAIN_PID_CLOSED")) {
        onPidChanged?.(pid);
      } else {
        if (!canIgnoreAwsTerminationError(log)) Logger.error(log);
      }
    });

    return {
      stop: () => {
        process.kill("SIGINT");
        this.stop();
      },
    };
  };

  // Disabling the warning because the method isn't implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getScreenRecorder(videoPath: string): ScreenRecorder | undefined {
    return undefined;
  }

  // Disabling the warning because the method isn't implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async stopApp(bundleId: string) {
    throw new Error("Method not implemented.");
  }

  public cleanup() {
    cleanup();
  }

  public abstract getDeviceCommand(command: string): string;
  protected abstract getAbi(): string;
  protected abstract pushExecutable(binaryTmpPath: string): void;
  protected abstract assertSupported(): void;
  public abstract getDeviceProfilerPath(): string;
  public abstract detectCurrentBundleId(): string;
  public abstract supportFPS(): boolean;
  public abstract detectDeviceRefreshRate(): number;
}
