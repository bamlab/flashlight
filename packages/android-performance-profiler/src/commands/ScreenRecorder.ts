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

async function waitForFileSizeIncrease(filePath: string): Promise<void> {
  let initialSize = -1;
  let currentSize = -1;

  do {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms

    const sizeResult = executeCommand(`adb shell ls -l ${filePath}`).toString();

    const sizeString = sizeResult.split(/\s+/)[4];
    currentSize = parseInt(sizeString, 10);

    if (initialSize === -1) {
      initialSize = currentSize;
    }
  } while (currentSize <= initialSize);
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
      this.process = await executeAsync(`adb shell screenrecord ${filePath}`);
      this.process.stderr?.on("data", (data) => {
        Logger.error(`screenrecord stderr: ${data}`);
      });

      // Wait for recording to start, the most precise way of checking it
      // is to check if the file size is increasing
      await waitForFileSizeIncrease(filePath);

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
