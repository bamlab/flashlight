import { performance } from "perf_hooks";

export class Trace {
  startTime: number;

  constructor() {
    this.startTime = performance.now();
  }

  stop() {
    const endTime = performance.now();
    return endTime - this.startTime;
  }
}
