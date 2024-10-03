import { Logger } from "@perf-profiler/logger";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { refreshRateManager } from "../detectCurrentDeviceRefreshRate";

export const parseLine = (
  line: string
): {
  timestamp: number;
  ending: boolean;
  methodName: string | undefined;
} => {
  let regexMatching = line.match(/ (\d+\.\d+): tracing_mark_write: ([A-Z])(.*)/);

  if (!regexMatching) {
    regexMatching = line.match(/ (\d+\.\d+): (.*)/);

    if (!regexMatching) {
      throw new Error(`Could not parse ATrace line "${line}"`);
    }
  }

  const [, timestamp, beginOrEnd, methodName] = regexMatching;

  return {
    timestamp: parseFloat(timestamp) * 1000,
    ending: beginOrEnd === "E",
    methodName,
  };
};

const TARGET_FRAME_RATE = refreshRateManager.getRefreshRate();
const TARGET_FRAME_TIME = 1000 / TARGET_FRAME_RATE;
Logger.info(`Target frame rate: ${TARGET_FRAME_RATE} Hz`);

export class FrameTimeParser {
  private methodStartedCount = 0;
  private doFrameStartedTimeStamp: number | null = null;

  getFrameTimes(
    output: string,
    pid: string
  ): {
    frameTimes: number[];
    interval: number;
  } {
    const lines = output.split(/\r\n|\n|\r/).filter(Boolean);

    if (lines.length === 0)
      return {
        frameTimes: [],
        interval: POLLING_INTERVAL,
      };

    const frameTimes: number[] = [];

    lines.forEach((line) => {
      try {
        if (!line.includes("-" + pid + " ")) return;

        const { timestamp, ending, methodName } = parseLine(line);

        if (ending) {
          this.methodStartedCount--;
          if (this.methodStartedCount <= 0) {
            if (this.doFrameStartedTimeStamp) {
              frameTimes.push(timestamp - this.doFrameStartedTimeStamp);
              this.doFrameStartedTimeStamp = null;
            }

            this.methodStartedCount = 0;
          }
        } else {
          if (methodName) {
            if (methodName.includes("Choreographer#doFrame")) {
              this.methodStartedCount = 1;
              this.doFrameStartedTimeStamp = timestamp;
            } else {
              this.methodStartedCount++;
            }
          }
        }
      } catch (error) {
        Logger.error(`Failed to parse Atrace line:
${line}

Error:
${error instanceof Error ? error.message : error}`);
      }
    });

    return {
      frameTimes,
      interval: parseLine(lines[lines.length - 1]).timestamp - parseLine(lines[0]).timestamp,
    };
  }

  static getFps(frameTimes: number[], timeInterval: number, uiCpuUsage: number) {
    const frameCount = frameTimes.length;

    const totalFrameTime = frameTimes.reduce(
      (sum, time) => sum + Math.max(TARGET_FRAME_TIME, time),
      0
    );

    /**
     * This is an approximation of idle time. When the user is not doing anything
     * and the app is not drawing any frames, we aim to set the value to 60FPS
     *
     * In RN apps, Choreographer#doFrame is always called, but for other apps
     * it might not be called, either because UI thread is too busy or because
     * the app is just not doing anything
     */
    const idleTime = (timeInterval - totalFrameTime) * (1 - uiCpuUsage / 100);
    // We add frame count in idle time as if we were running at 60fps still
    const idleTimeFrameCount = (idleTime / 1000) * TARGET_FRAME_RATE;

    const fps = ((frameCount + idleTimeFrameCount) / timeInterval) * 1000;

    return Math.max(0, Math.min(TARGET_FRAME_RATE, fps));
  }
}
