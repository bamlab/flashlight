import { Logger } from "@perf-profiler/logger";
import { executeAsync, executeCommand } from "./shell";
import { ChildProcess } from "child_process";

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

  constructor(file: string) {
    this.fileName = file;
  }

  async startRecording(): Promise<number> {
    if (!this.process) {
      const filePath = `${RECORDING_FOLDER}${this.fileName}`;

      this.process = executeAsync(
        `adb shell screenrecord ${filePath} --bit-rate 8000000 --verbose`
      );

      await new Promise<void>((resolve) => {
        this.process?.stdout?.on("data", (data) => {
          if (data.toString().includes("Content area is")) {
            resolve();
          }
        });
      });

      Logger.info("Recording started");
      return Date.now();
    }

    Logger.error("A screen recording is already in progress.");
    return 0;
  }

  async stopRecording(): Promise<void> {
    if (!this.process) return;

    const pid = this.process.pid;
    this.process.kill();
    this.process = undefined;

    // Wait for the process to stop running
    while (pid && (await isProcessRunning(pid))) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }

    Logger.info("Recording stopped");
  }

  async pullRecording(destinationPath: string): Promise<void> {
    await executeAsync(
      `adb pull ${RECORDING_FOLDER}${this.fileName} ${destinationPath}`
    );
    await executeAsync(`adb shell rm ${RECORDING_FOLDER}${this.fileName}`);
    Logger.info("Recording saved to" + destinationPath);
  }
}
