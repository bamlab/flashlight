---
sidebar_position: 2
---

# Usage with Maestro

For instance, if you're using [Maestro](https://github.com/mobile-dev-inc/maestro), you can measure the startup performance of the Twitter app:

1. Create a `twitter.yaml` file:

```yaml
appId: com.twitter.android
---
- launchApp
- assertVisible: Search and Explore
```

2. Measure performance 🚀

```bash
flashlight test --bundleId com.twitter.android \
  --testCommand "maestro test twitter.yaml" \
  --duration 10000 \
  --resultsFilePath results.json
```

3. Open the report

```bash
flashlight report results.json
```

# Getting a meaningful TTI

Maestro can be slow to start and stop. Since Flashlight times the execution of the test command, the measured test runtime might not be so meaningful.

We have a forked version of Maestro which helps with that, [here's the PR](https://github.com/mobile-dev-inc/maestro/pull/1902) that implements the missing features.

Start a Maestro session in one terminal:

```bash
npx @perf-profiler/maestro@latest start-session
```

Then replace `maestro test` by `npx @perf-profiler/maestro@latest test` for instance

```bash
flashlight test --bundleId com.twitter.android \
  --testCommand "npx @perf-profiler/maestro@latest test twitter.yaml" \
  --duration 10000 \
  --resultsFilePath results.json
```

"Average test runtime" will now measure the time from start of the app to the appearance of "Search & explore", so quite close to a TTI.
