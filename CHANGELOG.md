# [0.3.0](https://github.com/bamlab/flashlight/compare/v0.2.0...v0.3.0) (2023-04-19)

### Bug Fixes

- **profiler:** improve timings accuracy ([#84](https://github.com/bamlab/flashlight/issues/84)) ([1908689](https://github.com/bamlab/flashlight/commit/19086891b618382dd290431e63cf72059a729133))

### Features

- **test:** add --record options to have videos in report ([#86](https://github.com/bamlab/flashlight/issues/86)) ([2094d38](https://github.com/bamlab/flashlight/commit/2094d38845a8e96696fea94e91a91cc9f174931d))
- **flipper:** add windows support ([#77](https://github.com/bamlab/flashlight/issues/77)) ([b6d152c](https://github.com/bamlab/flashlight/commit/b6d152c88d6fd2e51ee02c75113ff51b076df386))
- **profiler:** group binder threads together in measures ([#89](https://github.com/bamlab/flashlight/issues/89)) ([543ffa7](https://github.com/bamlab/flashlight/commit/543ffa7f115b2f8dd62a01dca25f21d4b8fdd24d))
- **report:** add ability to see each iteration individually ([#83](https://github.com/bamlab/flashlight/issues/83)) ([a40f955](https://github.com/bamlab/flashlight/commit/a40f955beef5d85eb899c3a5be4d827d9a974467))

### BREAKING CHANGES

- **profiler:** if using a custom script, pollPerformanceMeasures will now take `{ onMeasure: (Measure) => void }` as second parameter

# [0.2.0](https://github.com/bamlab/flashlight/compare/v0.1.0...v0.2.0) (2023-04-04)

### BREAKING CHANGES

- `cloud`: `--apkPath` replaced by `--app`, adapt to new backend architecture

# [0.1.0](https://github.com/bamlab/flashlight/compare/v0.1.0...%40perf-profiler%2Fe2e%400.6.0) (2023-02-06)

`android-performance-profiler` becomes Flashlight 🔦

A standalone executable command called `flashlight` 🔦

More details on our revamped docs at [docs.flashlight.dev](https://docs.flashlight.dev)

### BREAKING CHANGES

- commands have additional prefix, prefer using the standalone executable `flashlight` instead of `npx @perf-profiler/...`

For instance:

-> `npx @perf-profiler/web-report` -> `flashlight report`
-> `npx @perf-profiler/e2e measure` -> `flashlight test`

### Features

- add simpler and nicer CLI command `flashlight measure` ([#70](https://github.com/bamlab/flashlight/issues/70)) ([61c87d1](https://github.com/bamlab/flashlight/commit/61c87d1ee24581bd24b91c9f94d16029ed78cdb6))
- **e2e:** add afterEach option ([#68](https://github.com/bamlab/flashlight/issues/68)) ([a95fb74](https://github.com/bamlab/flashlight/commit/a95fb7438c61120958f17a68f983ecec679a9ee9))
