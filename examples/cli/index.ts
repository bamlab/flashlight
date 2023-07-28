import {
  detectCurrentAppBundleId,
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";
import { getAverageCpuUsage } from "@perf-profiler/reporter";
import { ThreadNames } from "@perf-profiler/types";

const bundleId = detectCurrentAppBundleId().bundleId || "";
const pid = getPidId(bundleId) || "";

const measures: Measure[] = [];

const polling = pollPerformanceMeasures(pid, {
  onMeasure: (measure: Measure) => {
    measures.push(measure);
    console.log(`JS Thread CPU Usage: ${measure.cpu.perName[ThreadNames.JS_THREAD]}%`);
    console.log(`RAM Usage: ${measure.ram}MB`);
  },
});

setTimeout(() => {
  polling?.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
