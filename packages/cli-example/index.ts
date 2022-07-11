import {
  detectCurrentAppBundleId,
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@performance-profiler/profiler";
import { getAverageCpuUsage } from "@performance-profiler/reporter";

const bundleId = detectCurrentAppBundleId() || "";
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
