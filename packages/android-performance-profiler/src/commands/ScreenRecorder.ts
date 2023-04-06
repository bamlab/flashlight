import { Logger } from "@perf-profiler/logger";
import { executeAsync } from "./shell";
import { ChildProcess } from "child_process";

export class ScreenRecorder {
  private static fileName = "";
  private static process?: ChildProcess;

  static async startRecording(title: string, iteration: number): Promise<void> {
    if (!this.process) {
      this.fileName = `${title}_iter${iteration}.mp4`;
      this.process = await executeAsync(
        `adb shell screenrecord /mnt/sdcard/${this.fileName}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for recording to start
    } else {
      Logger.error("A screen recording is already in progress.");
    }
  }

  static async stopRecording(): Promise<void> {
    if (this.process) {
      //await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for recording to start
      // await executeAsync(`adb shell pkill -l2 screenrecord`);
      this.process.kill();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for recording to start
      this.process = undefined;
    } else {
      Logger.error("No screen recording is in progress.");
    }
  }

  static async pullRecording(destinationPath: string): Promise<void> {
    await executeAsync(
      `adb pull /mnt/sdcard/${this.fileName} ${destinationPath}`
    );
    await executeAsync(`adb shell rm /mnt/sdcard/${this.fileName}`);
    Logger.info("Recording saved to" + destinationPath);
  }
}

export default ScreenRecorder;
