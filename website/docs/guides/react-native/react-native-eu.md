---
sidebar_position: 2
---

# Measure and improve performance

Below is a video of a React Native EU talk where we see how to
- use Flashlight to measure the startup performance of a dummy app with lots of performance issues
- use different analysis tools to debunk the issues and fix them:
  - React DevTools
  - JS Hermes Flame graph
  - Android Studio

The code of the app is available [here](https://github.com/Almouro/test-app-performance-issues).

:::tip
The video uses an old version of Flashlight which required you to write a TS file. Now, you only have to run this command below 🥳:

```bash
flashlight test --bundleId com.reactnativefeed \
  --testCommand "adb shell am start com.reactnativefeed.MainActivity" \
  --duration 15000
```
:::

<iframe width="560" height="315" src="https://www.youtube.com/embed/3ieKK27lyxA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

