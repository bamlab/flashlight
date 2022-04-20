# Android Performance Profiler

Measure the performance of any Android app, even in production, via a Flipper plugin or directly via CLI.

https://user-images.githubusercontent.com/4534323/164205504-e07f4a93-25c1-4c14-82f3-5854ae11af8e.mp4

## Flipper Plugin

### Install

The plugin doesn't appear in the Flipper marketplace yet. In the meantime, you can install it manually:

- Download the [package from npm](https://registry.npmjs.org/flipper-plugin-android-performance-profiler/-/flipper-plugin-android-performance-profiler-0.1.1.tgz)
- Add it via the bottom left input on the Flipper Plugin Manager

![package manager](https://user-images.githubusercontent.com/4534323/164198127-f796476b-993a-4b14-bf48-9db11072caba.png)

## CLI

Multiple commands are also available in the standalone package `android-performance-profiler`.

_:warning: they will be subject to breaking changes_

For instance:

```ts
import {
  detectCurrentAppBundleId,
  getAverageCpuUsage,
  getPidId,
  Measure,
  pollCpuPerCoreUsage,
} from "android-performance-profiler";

const bundleId = detectCurrentAppBundleId();
const pidId = getPidId(bundleId);

const measures: Measure[] = [];

const polling = pollCpuPerCoreUsage(pidId, (measure) => {
  measures.push(measure);
  console.log(`JS Thread CPU Usage: ${measure.perName["(mqt_js)"]}%`);
});

setTimeout(() => {
  polling.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
```
