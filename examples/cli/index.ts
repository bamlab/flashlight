import { profiler } from "@perf-profiler/profiler";
import { getAverageCpuUsage } from "@perf-profiler/reporter";
import { Measure, ThreadNames } from "@perf-profiler/types";

const bundleId = profiler.detectCurrentBundleId() || "";

const measures: Measure[] = [];

const polling = profiler.pollPerformanceMeasures(bundleId, {
  onMeasure: (measure: Measure) => {
    measures.push(measure);
    console.log(`JS Thread CPU Usage: ${measure.cpu.perName[ThreadNames.RN.JS_ANDROID]}%`);
    console.log(`RAM Usage: ${measure.ram}MB`);
  },
});

setTimeout(() => {
  polling?.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
