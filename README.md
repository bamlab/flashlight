# Measure the performance of any Android app 🚀

- 🙅 No installation required, supports even production app
- ✨ Generates beautiful web report ([like this Flatlist/Flashlist comparison](https://bamlab.github.io/android-performance-profiler/report/complex-list/s10/report.html))
- 💻 Via E2E test, Flipper plugin or CLI

<img width="596" alt="image" src="https://user-images.githubusercontent.com/4534323/187192078-402c306e-4d29-465c-bdfa-f278e7f0b927.png">

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting started with the automated profiler](#getting-started-with-the-automated-profiler)
  - [Main usage](#main-usage)
  - [Customizing web report](#customizing-web-report)
  - [Using other e2e frameworks](#using-other-e2e-frameworks)
  - [Advanced usage](#advanced-usage)
  - [Comparing](#comparing)
  - [Exploiting measures](#exploiting-measures)
  - [Running in CI](#running-in-ci)
    - [AWS Device Farm](#aws-device-farm)
    - [Reusing APK](#reusing-apk)
    - [Advanced usage](#advanced-usage-1)
- [Flipper Plugin](#flipper-plugin)
- [CLI](#cli)
  - [Via Custom script](#via-custom-script)
- [Contributing](#contributing)
  - [web-reporter](#web-reporter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started with the automated profiler

### Main usage

_Feel free to try this out using [our example APK](https://github.com/bamlab/android-performance-profiler/blob/main/.github/workflows/example.apk)_

#### Requirements

- [Node](https://nodejs.org/en/)
- An Android phone plugged in 🔌 (or an emulator started)

#### 1. Install the profiler

`yarn add --dev @perf-profiler/e2e`

#### 2. Create a TS script including an e2e performance test

You can use any TS/JS based e2e framework (or just simple `adb shell` commands).  
Here's an example using our own [Appium Helper](./packages/appium-helper) (install it with `yarn add @bam.tech/appium-helper`)

```ts
import { AppiumDriver } from "@bam.tech/appium-helper";
import { TestCase, measurePerformance } from "@perf-profiler/e2e";

const bundleId = "com.example";
const appActivity = "com.example.MainActivity";

const runTest = async () => {
  const driver = await AppiumDriver.create({
    appPackage: bundleId,
    appActivity,
  });

  const testCase: TestCase = {
    beforeTest: async () => {
      driver.stopApp();
    },
    run: async () => {
      // run is where measuring will happen, insert e2e logic here
      driver.startApp();
      await driver.findElementByText("KILL JS");
    },
    // Duration is optional, but helps in getting consistent measures.
    // Measures will be taken for this duration, regardless of test duration
    duration: 10000,
  };

  const { writeResults } = await measurePerformance(bundleId, testCase);
  writeResults();
};

runTest();
```

You have to replace a few elements in this script:

- the **bundleId** _(You can use `npx @perf-profiler/profiler getCurrentApp` to display info for the app opened on your phone)_
- the **appActivity**
- insert your e2e logic inside the `run` function

#### 3. Run the test

- Run `npx appium` in one tab
- Run `npx ts-node yourScriptName.ts` in a separate tab

This will produce a JSON file full of measures.

#### 4. Open the web report

Open the JSON file generated in the web profiler:

```sh
npx @perf-profiler/web-reporter yourResultFileName.json
```

_Replace `yourResultFileName` with the name of the result file that was generated. It was printed in output of the previous appium command._

### Customizing web report

You can change the path to which results are written

```ts
const { writeResults } = await measurePerformance(bundleId, testCase);
writeResults({
  title: "My awesome title",
  path: "./awesome-results.json",
});
```

### Using other e2e frameworks

Any e2e framework running tests via JS/TS should be supported. Switch `@bam.tech/appium-helper` with something else

### Advanced usage

Check out [the examples folder](./examples) for more advanced usage:

- [Running with Jest](./examples/e2e/appium.test.ts)

### Comparing

If you have several JSON files of measures, you can open the comparison view with:

```sh
npx @perf-profiler/web-reporter results1.json results2.json results3.json
```

### Exploiting measures

Measures are also directly exploitable from the `mesurePerformance` function.
You can install the `@perf-profiler/reporter` package to get access to reporting functions for averaging...

```ts
import {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
} from "@perf-profiler/reporter";

...

const { measures } = await measurePerformance(bundleId, testCase);

const cpuPerTestIteration = measures.map((measure) =>
  getAverageCpuUsage(measure.measures)
);
```

### Running in CI

To run in CI, you'll need the CI to be connected to an Android device. An emulator running on the CI will likely be too slow, so it's best to be connected to a device farm cloud. The profiler needs full `adb` access, so only few device cloud are compatible:

Our choice is **AWS Device Farm** but some other options should work as well (though they haven't been tested):

- Saucelabs with Entreprise plan and [Virtual USB](https://docs.saucelabs.com/mobile-apps/features/virtual-usb/)
- [Genymotion Cloud](https://www.genymotion.com/pricing/) (using emulators will not accurately reproduce the performance of a real device)

#### AWS Device Farm

We've added a neat tool to seamlessly run your tests on AWS Device Farm and get the measures back:

```sh
export AWS_ACCESS_KEY_ID="ADD YOUR AWS KEY ID HERE" AWS_SECRET_ACCESS_KEY="ADD YOUR AWS SECRET HERE"

# If you have a simple TS script to run
npx @perf-profiler/aws-device-farm runTest --apkPath app-release.apk --testFile script.ts
```

#### Reusing APK

You might also want to upload your APK only once and reuse it:

```sh
# This will log the "ARN" associated with your APK
npx @perf-profiler/aws-device-farm uploadApk --apkPath app-release.apk
# ...

export APK_UPLOAD_ARN="arn:aws:devicefarm:..."
npx @perf-profiler/aws-device-farm runTest --testFile script.ts
```

#### Advanced usage

For more complex cases, run from your root folder, containing `node_modules`:

```sh
npx @perf-profiler/aws-device-farm runTest \
 --apkPath app-release.apk \
 --deviceName "A10s" \
 --testCommand "yarn jest appium"
```

## Flipper Plugin

https://user-images.githubusercontent.com/4534323/164205504-e07f4a93-25c1-4c14-82f3-5854ae11af8e.mp4

To install, simply search for `android-performance-profiler` in the Flipper marketplace![image](https://user-images.githubusercontent.com/4534323/165071805-bf553b14-42f5-441b-8771-139bfb613941.png)

## CLI

You can profile directly in CLI with:

```

npx @perf-profiler/profiler profile --fps --ram --threadNames "(mqt_js)" "UI Thread"

```

You can also use a custom script:

### Via Custom script

For instance:

```ts
import {
  detectCurrentAppBundleId,
  getAverageCpuUsage,
  getPidId,
  Measure,
  pollPerformanceMeasures,
} from "@perf-profiler/profiler";

const { bundleId } = detectCurrentAppBundleId();
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
testCaseResults = [require("../measures.json")];
```

You should now be able to open [the local server](http://localhost:1234/)

Run `yarn jest Plugin -u` after modifications.
