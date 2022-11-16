import { Logger } from "@perf-profiler/logger";
import { performance } from "perf_hooks";

export class Trace {
  startTime: number;

  constructor() {
    this.startTime = performance.now();
    Logger.debug(`Started trace`);
  }

  stop() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    Logger.debug(`Ended trace ${duration}`);

    return duration;
  }
}
