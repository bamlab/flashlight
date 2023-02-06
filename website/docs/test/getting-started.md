---
sidebar_position: 1
---

# Getting started

## 1. Run the test command

If you have an e2e test script, you can run:

```bash
flashlight test --bundleId <your app bundle id> \
  --testCommand <your e2e test command> \
  --duration 10000 \
  --resultsFilePath results.json
```

- This will run your e2e test 10 times (by default), measure performance during 10s for each iteration and write measures to `results.json`
- Use `npx @perf-profiler/profiler getCurrentApp` to display the bundle id of the app opened on your phone
- _⚠️ Your e2e test command should start the app_


### Example: quickly measure startup performance

Using `adb shell` you can start the app with `adb shell monkey -p <bundleid>  -c android.intent.category.LAUNCHER 1`

You can just pass this to `flashlight test`, for instance, measure startup performance of the Twitter app with:

```bash
flashlight test --bundleId "com.twitter.android" \
  --testCommand "adb shell monkey -p com.twitter.android  -c android.intent.category.LAUNCHER 1" \
  --duration 10000
```

### Going further

You'll notice in the previous example that the "Average Test runtime" metric will not give you a proper Time To Interactive metric. 

To go further, use a proper e2e testing framework (Appium, Detox, Maestro...). 

If you're not using one yet, we recommend to use [Maestro](https://github.com/mobile-dev-inc/maestro)! 
Check out our [Maestro guide](./maestro) to get started quickly with Flashlight and Maestro.

## 2. Open the web report

You can then open the web report for those measures:

```bash
flashlight report results.json
```
