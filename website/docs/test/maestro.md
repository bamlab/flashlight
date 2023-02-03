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
