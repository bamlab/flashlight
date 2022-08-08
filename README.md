# Android Performance Profiler

Measure the performance of any Android app, even in production, via a Flipper plugin or directly via CLI.

https://user-images.githubusercontent.com/4534323/164205504-e07f4a93-25c1-4c14-82f3-5854ae11af8e.mp4

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting started with the automated profiler](#getting-started-with-the-automated-profiler)
- [Flipper Plugin](#flipper-plugin)
  - [Install](#install)
- [CLI](#cli)
- [Getting FPS Data](#getting-fps-data)
- [Contributing](#contributing)
  - [web-reporter](#web-reporter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started with the automated profiler

1. Install the profiler

```sh
yarn add --dev @perf-profiler/e2e
```

2. Write a test

For instance, here we'll be testing the start up performance of the app for 10 iterations:

```ts
import { execSync } from "child_process";
import { TestCase, measurePerformance } from "@perf-profiler/e2e";

const bundleId = "com.reactnativefeed";
const appActivity = `${bundleId}.MainActivity`;

const stopApp = () => execSync(`adb shell am force-stop ${bundleId}`);
const startApp = () =>
  execSync(`adb shell am start ${bundleId}/${appActivity}`);

const startTestCase: TestCase = {
  duration: 15000,
  beforeTest: () => {
    stopApp();
  },
  run: () => {
    startApp();
  },
};

const test = async () => {
  const { measures, writeResults } = await measurePerformance(
    bundleId,
    startTestCase,
    10
  );
  writeResults();
};

test();
```

3. Open the JSON file generated in the web profiler:

```sh
yarn add --dev @perf-profiler/web-reporter
yarn generate-performance-web-report results.json
```

If you don't see FPS data, see [Getting FPS Data](#getting-fps-data).

## Flipper Plugin

### Install

Search for `android-performance-profiler` in the Flipper marketplace![image](https://user-images.githubusercontent.com/4534323/165071805-bf553b14-42f5-441b-8771-139bfb613941.png)

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
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";

const bundleId = detectCurrentAppBundleId();
const pid = getPidId(bundleId);

const measures: Measure[] = [];

const polling = pollPerformanceMeasures(pid, (measure) => {
  measures.push(measure);
  console.log(`JS Thread CPU Usage: ${measure.perName["(mqt_js)"]}%`);
});

setTimeout(() => {
  polling.stop();
  const averageCpuUsage = getAverageCpuUsage(measures);
  console.log(`Average CPU Usage: ${averageCpuUsage}%`);
}, 10000);
```

## Getting FPS Data

FPS debug should be enabled automatically when you run a test. If it doesn't work on your device, follow the steps below:

In developer options, you need to set _Profile HWUI rendering_ to `In adb shell dumpsys gfxinfo`

<img width="453" alt="image" src="https://user-images.githubusercontent.com/4534323/182430625-e051c5aa-8153-46ad-a3f2-b095a2dadf25.png">

Note that this method of recording FPS supports only Native (including RN) apps.

## Contributing

### web-reporter

At the root of the repo:

```
yarn
yarn tsc --build --w
```

and run in another terminal:

```
yarn workspace @perf-profiler/web-reporter start
```

Then in `packages/web-reporter/src/App.tsx`, uncomment the lines to add your own measures:

```ts
// Uncomment with when locally testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
testCaseResults = [
  require("../measures.json"),
];
```

You should now be able to open [the local server](http://localhost:1234/)

Run `yarn jest Plugin -u` after modifications.
