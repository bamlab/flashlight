---
sidebar_position: 5
---

# Running measures programmatically

_Feel free to try this out using [our example APK](https://github.com/bamlab/android-performance-profiler/blob/main/.github/workflows/example.apk)_

#### 1. Install the profiler

`yarn add --dev @perf-profiler/e2e`

#### 2. Create a TS script including an e2e performance test

You can use any TS/JS based e2e framework (or just simple `adb shell` commands).  
Here's an example using our own [Appium Helper](https://github.com/bamlab/android-performance-profiler/tree/main/packages/appium-helper) (install it with `yarn add @bam.tech/appium-helper`)

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
flashlight report yourResultFileName.json
```

_Replace `yourResultFileName` with the name of the result file that was generated. It was printed in output of the previous appium command._
