import {
  detectCurrentAppBundleId,
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";
import { getAverageCpuUsage } from "@perf-profiler/reporter";

const bundleId = detectCurrentAppBundleId().bundleId || "";
const pid = getPidId(bundleId) || "";

const measures: Measure[] = [];

const polling = pollPerformanceMeasures(pid, (measure) => {
  measures.push(measure);
  console.log(`JS Thread CPU Usage: ${measure.cpu.perName["(mqt_js)"]}%`);
  console.log(`RAM Usage: ${measure.ram}MB`);
});

setTimeout(() => {
  polling?.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
