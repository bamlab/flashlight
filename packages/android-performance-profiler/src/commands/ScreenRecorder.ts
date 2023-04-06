import { Logger } from "@perf-profiler/logger";
import { executeAsync } from "./shell";
import { ChildProcess } from "child_process";

export class ScreenRecorder {
  private static currentIteration = 0;
  private static process?: ChildProcess;

  static async startRecording(iteration: number): Promise<void> {
    if (!this.process) {
      this.currentIteration = iteration;
      this.process = await executeAsync(
        `adb shell screenrecord /mnt/sdcard/result_${this.currentIteration}.mp4`
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
      `adb pull /mnt/sdcard/result_${this.currentIteration}.mp4 ${destinationPath}`
    );
    Logger.info("Recording saved to" + destinationPath);
  }
}

export default ScreenRecorder;
