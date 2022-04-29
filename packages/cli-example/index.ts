import {
  detectCurrentAppBundleId,
  getAverageCpuUsage,
  getPidId,
  Measure,
  pollCpuPerCoreUsage,
  pollRamUsage,
} from "android-performance-profiler";

const bundleId = detectCurrentAppBundleId() || "";
const pidId = getPidId(bundleId) || "";

const measures: Measure[] = [];

// const polling = pollCpuPerCoreUsage(pidId, (measure) => {
//   measures.push(measure);
//   console.log(`JS Thread CPU Usage: ${measure.perName["(mqt_js)"]}%`);
// });

// setTimeout(() => {
//   polling.stop();
//   const averageCpuUsage = getAverageCpuUsage(measures);
//   console.log(`Average CPU Usage: ${averageCpuUsage}%`);
// }, 10000);

pollRamUsage(pidId);
