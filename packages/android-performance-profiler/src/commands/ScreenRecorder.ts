import { Logger } from "@perf-profiler/logger";
import { executeAsync, executeCommand } from "./shell";
import { ChildProcess } from "child_process";
import { waitFor } from "../utils/waitFor";

const RECORDING_FOLDER = "/data/local/tmp/";

async function isProcessRunning(pid: number): Promise<boolean> {
  try {
    const result = executeCommand(`adb shell ps -p ${pid}`).toString();
    return result.includes(pid.toString());
  } catch (error) {
    return false;
  }
}

export class ScreenRecorder {
  private fileName;
  private process?: ChildProcess = undefined;
  private recordingStartTime = 0;

  constructor(file: string) {
    this.fileName = file;
  }

  async startRecording({
    bitRate = 8000000,
    size,
  }: {
    bitRate?: number;
    size?: string;
  } = {}): Promise<void> {
    const filePath = `${RECORDING_FOLDER}${this.fileName}`;

    this.process = executeAsync(
      `adb shell screenrecord ${filePath} --bit-rate ${bitRate} ${
        size ? `--size ${size}` : ""
      } --verbose`
    );

    await new Promise<void>((resolve) => {
      this.process?.stdout?.on("data", (data) => {
        if (data.toString().includes("Content area is")) {
          resolve();
        }
      });
    });

    Logger.info("Recording started");
    this.recordingStartTime = performance.now();
  }

  async stopRecording(): Promise<void> {
    if (!this.process) return;

    // Wait an arbitrary 5 seconds to make sure the recording captures everything we want
    // Otherwise, sometimes we miss the end of the video
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const pid = this.process.pid;
    this.process.kill("SIGINT");
    this.process = undefined;

    // Wait for the process to stop running
    await waitFor(async () => pid && (await isProcessRunning(pid)), {
      timeout: 10000,
      checkInterval: 100,
    });

    // Wait an arbitrary time to ensure we don't end up with a corrupted video
    await new Promise((resolve) => setTimeout(resolve, 500));

    Logger.info("Recording stopped");
  }

  getRecordingStartTime(): number {
    return this.recordingStartTime;
  }

  async pullRecording(destinationPath: string): Promise<void> {
    executeCommand(`adb pull ${RECORDING_FOLDER}${this.fileName} ${destinationPath}`);
    executeCommand(`adb shell rm ${RECORDING_FOLDER}${this.fileName}`);
    Logger.info(`Recording saved to ${destinationPath}/${this.fileName}`);
  }
}
