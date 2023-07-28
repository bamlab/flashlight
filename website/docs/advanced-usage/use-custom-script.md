# Use custom script

You can use the standalone reporter in your own script:

```ts
import {
  detectCurrentAppBundleId,
  getAverageCpuUsage,
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";
import { ThreadNames } from "@perf-profiler/types";

const { bundleId } = detectCurrentAppBundleId();
const pid = getPidId(bundleId);

const measures: Measure[] = [];

const polling = pollPerformanceMeasures(pid, {
  onMeasure: (measure) => {
    measures.push(measure);
    console.log(`JS Thread CPU Usage: ${measure.cpu.perName[ThreadNames.JS_THREAD]}%`);
  },
});

setTimeout(() => {
  polling.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
```
