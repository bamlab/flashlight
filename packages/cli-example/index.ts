import {
  detectCurrentAppBundleId,
  getAverageCpuUsage,
  getPidId,
  Measure,
  pollCpuPerCoreUsage,
} from "android-performance-profiler";

const bundleId = detectCurrentAppBundleId() || "";
const pidId = getPidId(bundleId) || "";

const measures: Measure[] = [];

const polling = pollCpuPerCoreUsage(pidId, (measure) => {
  measures.push(measure);
  console.log(`JS Thread CPU Usage: ${measure.cpu.perName["(mqt_js)"]}%`);
  console.log(`RAM Usage: ${measure.ram}MB`);
});

setTimeout(() => {
  polling?.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
