# Measure the performance of any Android app 🚀

- 🙅 No installation required, supports even production app
- ✨ Generates beautiful web report ([like this Flatlist/Flashlist comparison](https://bamlab.github.io/android-performance-profiler/report/complex-list/s10/report.html))
- 💻 Via E2E test, Flipper plugin or CLI

<img width="596" alt="image" src="https://user-images.githubusercontent.com/4534323/187192078-402c306e-4d29-465c-bdfa-f278e7f0b927.png">

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting started with the automated profiler](#getting-started-with-the-automated-profiler)
  - [Requirements](#requirements)
  - [Main usage](#main-usage)
  - [Example using Maestro](#example-using-maestro)
  - [Customizing web report](#customizing-web-report)
  - [Comparing measures](#comparing-measures)
  - [Advanced usage using TypeScript](#advanced-usage-using-typescript)
    - [Examples folder](#examples-folder)
  - [Running in CI](#running-in-ci)
    - [AWS Device Farm](#aws-device-farm)
    - [Reusing APK](#reusing-apk)
    - [Advanced usage](#advanced-usage)
- [Flipper Plugin](#flipper-plugin)
  - [Install](#install)
  - [Usage](#usage)
- [CLI](#cli)
  - [Via Custom script](#via-custom-script)
- [Contributing](#contributing)
  - [web-reporter](#web-reporter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started with the automated profiler

### Requirements

- [Node](https://nodejs.org/en/)
- An Android phone plugged in 🔌 (or an emulator started)

### Main usage

1. If you have an e2e test script, you can run:

```sh
npx @perf-profiler/e2e measure --bundleId <your app bundle id> \
  --testCommand <your e2e test command> \
  --duration 10000 \
  --resultsFilePath results.json
```

- This will run your e2e test 10 times (by default), measure performance during 10s for each iteration and write measures to `results.json`
- Use `npx @perf-profiler/profiler getCurrentApp` to display the bundle id of the app opened on your phone
- _⚠️ Your e2e test command should start the app_

2. You can then open the web report for those measures:

```
npx @perf-profiler/web-reporter results.json
```

### Example using Maestro

For instance, if you're using [Maestro](https://github.com/mobile-dev-inc/maestro), you can measure the startup performance of the Twitter app:

1. Create a `twitter.yaml` file:

```yml
appId: com.twitter.android
---
- launchApp
- tapOn: Search and Explore
```

2. Measure performance 🚀

```sh
npx @perf-profiler/e2e measure --bundleId com.twitter.android \
  --testCommand "maestro test twitter.yaml" \
  --duration 10000 \
  --resultsFilePath results.json
```

3. Open the report

```
npx @perf-profiler/web-reporter results.json
```

### Customizing web report

You can change the title displayed in the web report by passing `--resultsTitle`:

```sh
npx @perf-profiler/e2e measure --bundleId com.twitter.android \
 --testCommand "maestro test twitter.yaml` \
 --resultsTitle "Twitter - App start"
```

### Comparing measures

If you have several JSON files of measures, you can open the comparison view with:

```sh
npx @perf-profiler/web-reporter results1.json results2.json results3.json
```

### Setting number of iterations to be run

By default, 10 iterations of your test will be run, and measures will be averaged. You can change this by passing `--iterationCount`:

```sh
npx @perf-profiler/e2e measure --bundleId com.twitter.android \
 --testCommand "maestro test twitter.yaml` \
 --iterationCount 5
```

### Advanced usage using TypeScript

You can also run measures and exploit results programmatically via TypeScript.
See [here](./docs/advanced_typescript_usage.md)

#### Examples folder

Check out [the examples folder](./examples) for more advanced usage:

- [Running programmatically with Jest](./examples/e2e/appium.test.ts)

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
 --testFolder . \
 --testCommand "yarn jest appium"
```

## Flipper Plugin

https://user-images.githubusercontent.com/4534323/199497712-ab099530-959d-4592-b132-f0a7e00275de.mp4

### Install

Simply search for `android-performance-profiler` in the Flipper marketplace. No further installation required! 🥳
<img width="762" alt="image" src="https://user-images.githubusercontent.com/4534323/199498135-153de5ef-c730-49c8-b4c5-c1e9f22b50ff.png">

### Usage

- Start your app
- Click "AUTO-DETECT"
- Then start measuring! 🚀

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

Start by building the whole project:

At the root of the repo:

```
yarn
yarn watch
```

Keep this open in one terminal.

### web-reporter

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

### e2e

You can now run `node packages/e2e-performance/dist/bin.js` instead of `npx @perf-profiler/e2e`

### Flipper plugin

- Add the path to the `packages` folder in `~/.flipper/config.json`.

For instance, my `config.json` is currently
`{"pluginPaths":["/Users/almouro/dev/projects/android-performance-profiler/packages"],"disabledPlugins":[],"darkMode":"system","updaterEnabled":true,"launcherEnabled":true,"lastWindowPosition":{"x":-195,"y":-1415,"width":1280,"height":1415}}`

- in the `packages/flipper-plugin-android-performance-profiler`, run `yarn watch`.

You should now see your local plugin in Flipper (ensure you have uninstalled the one from the marketplace), in the disabled plugin section if you're installing for the first time.

⚠️ _when modifying files outside of the `packages/flipper-plugin-android-performance-profiler`, live reload sometimes doesn't work and you need to re-run `yarn watch` for changes to take effect_ 😕
