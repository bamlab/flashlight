import fs from "fs";
import os from "os";
import { Logger } from "@perf-profiler/logger";
import { executeCommand } from "../shell";

export const CppProfilerName = `BAMPerfProfiler`;

// Since Flipper uses esbuild, we copy the bin folder directly
// into the Flipper plugin directory
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const binaryFolder = global.Flipper
  ? `${__dirname}/bin`
  : `${__dirname}/../../..${__dirname.includes("dist") ? "/.." : ""}/cpp-profiler/bin`;

export abstract class UnixProfiler {
  stop(): void {
    throw new Error("Method not implemented.");
  }
  private hasInstalledProfiler = false;
  private cpuClockTick: number | undefined;
  private RAMPageSize: number | undefined;

  ensureCppProfilerIsInstalled(): void {
    if (!this.hasInstalledProfiler) {
      this.assertSupported();
      this.installCppProfilerOnDevice();
      this.retrieveCpuClockTick();
      this.retrieveRAMPageSize();
    }
    this.hasInstalledProfiler = true;
  }

  retrieveCpuClockTick() {
    this.cpuClockTick = parseInt(
      executeCommand(this.getDeviceCommand(`${this.getDeviceProfilerPath()} printCpuClockTick`)),
      10
    );
  }

  retrieveRAMPageSize() {
    this.RAMPageSize = parseInt(
      executeCommand(this.getDeviceCommand(`${this.getDeviceProfilerPath()} printRAMPageSize`)),
      10
    );
  }

  getCpuClockTick(): number {
    this.ensureCppProfilerIsInstalled();
    if (!this.cpuClockTick) {
      throw new Error("CPU clock tick not initialized");
    }
    return this.cpuClockTick;
  }

  getRAMPageSize(): number {
    this.ensureCppProfilerIsInstalled();
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

  public abstract getDeviceCommand(command: string): string;
  protected abstract getAbi(): string;
  protected abstract pushExecutable(binaryTmpPath: string): void;
  protected abstract assertSupported(): void;
  public abstract getDeviceProfilerPath(): string;
  public abstract detectCurrentBundleId(): string;
  public abstract supportFPS(): boolean;
}
