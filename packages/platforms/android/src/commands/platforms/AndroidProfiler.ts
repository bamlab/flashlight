import { Logger } from "@perf-profiler/logger";
import { ChildProcess, execSync } from "child_process";
import { executeAsync, executeCommand } from "../shell";
import { getAbi } from "../getAbi";
import { detectCurrentAppBundleId } from "../detectCurrentAppBundleId";
import { CppProfilerName, UnixProfiler } from "./UnixProfiler";
import { ScreenRecorder } from "../ScreenRecorder";
import { refreshRateManager } from "../detectCurrentDeviceRefreshRate";

export class AndroidProfiler extends UnixProfiler {
  private aTraceProcess: ChildProcess | null = null;

  installProfilerOnDevice(): void {
    super.installProfilerOnDevice();
    if (!this.aTraceProcess) this.startATrace();
  }

  stop(): void {
    this.stopATrace();
  }

  assertSupported(): void {
    const sdkVersion = parseInt(executeCommand("adb shell getprop ro.build.version.sdk"), 10);

    if (sdkVersion < 24) {
      throw new Error(
        `Your Android version (sdk API level ${sdkVersion}) is not supported. Supported versions > 23.`
      );
    }
  }

  protected pushExecutable(binaryTmpPath: string): void {
    executeCommand(`adb push ${binaryTmpPath} ${this.getDeviceProfilerPath()}`);
    executeCommand(`adb shell chmod 755 ${this.getDeviceProfilerPath()}`);
  }

  public getDeviceProfilerPath(): string {
    return `/data/local/tmp/${CppProfilerName}`;
  }

  protected stopATrace() {
    // We need to close this process, otherwise tests will hang
    Logger.debug("Stopping atrace process...");
    this.aTraceProcess?.kill();
    this.aTraceProcess = null;
  }

  protected startATrace() {
    Logger.debug("Stopping atrace and flushing output...");
    /**
     * Since output from the atrace --async_stop
     * command can be quite big, seems like buffer overflow can happen
     * Let's ignore the output then
     *
     * See https://stackoverflow.com/questions/63796633/spawnsync-bin-sh-enobufs
     */
    execSync("adb shell atrace --async_stop", { stdio: "ignore" });
    Logger.debug("Starting atrace...");
    this.aTraceProcess = executeAsync("adb shell atrace -c view -t 999");
  }

  public getDeviceCommand(command: string): string {
    return `adb shell ${command}`;
  }

  protected getAbi(): string {
    return getAbi();
  }

  public detectCurrentBundleId(): string {
    return detectCurrentAppBundleId().bundleId;
  }

  public supportFPS(): boolean {
    return true;
  }

  public getScreenRecorder(videoPath: string) {
    return new ScreenRecorder(videoPath);
  }

  async stopApp(bundleId: string) {
    execSync(`adb shell am force-stop ${bundleId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  public detectDeviceRefreshRate(): number {
    return refreshRateManager.getRefreshRate();
  }
}
