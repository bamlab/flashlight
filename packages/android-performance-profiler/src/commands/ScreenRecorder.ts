import { Logger } from "@perf-profiler/logger";
import { executeAsync } from "./shell";
import { ChildProcess } from "child_process";

async function waitForFileSizeIncrease(filePath: string): Promise<void> {
  let initialSize = -1;
  let currentSize = -1;

  do {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms

    const sizeResult = await new Promise<string>((resolve, reject) => {
      const process = executeAsync(`adb shell ls -l ${filePath}`);
      let output = "";

      process.stdout?.on("data", (data) => {
        output += data.toString();
      });

      process.stdout?.on("end", () => {
        resolve(output);
      });

      process.on("error", (error) => {
        reject(error);
      });
    });

    const sizeString = sizeResult.split(/\s+/)[4];
    currentSize = parseInt(sizeString, 10);

    if (initialSize === -1) {
      initialSize = currentSize;
    }
  } while (currentSize <= initialSize);
}

export class ScreenRecorder {
  private static fileName = "";
  private static process?: ChildProcess;

  static async startRecording(title: string, iteration: number): Promise<void> {
    if (!this.process) {
      this.fileName = `${title}_iter${iteration}.mp4`;
      const filePath = `/data/local/tmp/${this.fileName}`;
      this.process = await executeAsync(`adb shell screenrecord ${filePath}`);
      this.process.stderr?.on("data", (data) => {
        Logger.error(`screenrecord stderr: ${data}`);
      });
      await waitForFileSizeIncrease(filePath);
      Logger.info("Recording started");
    } else {
      Logger.error("A screen recording is already in progress.");
    }
  }

  static async stopRecording(): Promise<void> {
    if (this.process) {
      //await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for recording to start
      // await executeAsync(`adb shell pkill -l2 screenrecord`);
      this.process.kill();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for recording to start
      Logger.info("Recording stopped");
      this.process = undefined;
    } else {
      Logger.error("No screen recording is in progress.");
    }
  }

  static async pullRecording(destinationPath: string): Promise<void> {
    await executeAsync(
      `adb pull /data/local/tmp/${this.fileName} ${destinationPath}`
    );
    await executeAsync(`adb shell rm /data/local/tmp/${this.fileName}`);
    Logger.info("Recording saved to" + destinationPath);
  }
}
