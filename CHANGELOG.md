## [0.7.3](https://github.com/bamlab/flashlight/compare/v0.7.1...v0.7.3) (2023-05-25)

### Bug Fixes

- **profiler:** fix buffer overflow when running atrace async_stop ([#107](https://github.com/bamlab/flashlight/issues/107)) ([f06a849](https://github.com/bamlab/flashlight/commit/f06a849d9c3acc70ca8da488b93e269b27d54484))
- **profiler:** fix some cpu measuring inaccuracies ([#109](https://github.com/bamlab/flashlight/issues/109)) ([79b6f79](https://github.com/bamlab/flashlight/commit/79b6f79f3d9c60581fdaadf5a52a053b2b64320c)), closes [392744175c4de67dc98e72da6745e6351118c985/toolbox/top.c#422](https://github.com/392744175c4de67dc98e72da6745e6351118c985/toolbox/top.c/issues/422)

## [0.7.2](https://github.com/bamlab/flashlight/compare/v0.7.1...v0.7.2) (2023-05-19)

### Bug Fixes

- **profiler:** fix buffer overflow when running atrace async_stop ([#107](https://github.com/bamlab/flashlight/issues/107)) ([f06a849](https://github.com/bamlab/flashlight/commit/f06a849d9c3acc70ca8da488b93e269b27d54484))

## [0.7.1](https://github.com/bamlab/flashlight/compare/v0.7.0...v0.7.1) (2023-05-09)

### Bug Fixes

- **test:** stop polling measures on failure ([e5500bf](https://github.com/bamlab/flashlight/commit/e5500bf9d251e12503fb8331df2eee1fbfa4f47d))

# [0.7.0](https://github.com/bamlab/flashlight/compare/v0.5.0...v0.7.0) (2023-05-08)

### Bug Fixes

- **profiler:** fallback on alternative atrace file for certain devices ([#100](https://github.com/bamlab/flashlight/issues/100)) ([93ad2c8](https://github.com/bamlab/flashlight/commit/93ad2c84f9a4bc2cdb2d1f5e42841b906c1a0adb))

### Features

- **flipper:** integrate new design ([#104](https://github.com/bamlab/flashlight/issues/104)) ([b3410b5](https://github.com/bamlab/flashlight/commit/b3410b5848f715d2475bc12d6d13e28bc78b79ad))
- **report:** design adjustments ([#102](https://github.com/bamlab/flashlight/issues/102)) ([5a55689](https://github.com/bamlab/flashlight/commit/5a5568922c5768fb3d01fa9027d23bb71c89c3f3))

# [0.6.0](https://github.com/bamlab/flashlight/compare/v0.5.0...v0.6.0) (2023-05-03)

# [0.5.0](https://github.com/bamlab/flashlight/compare/v0.4.0...v0.5.0) (2023-04-28)

### Features

- **report:** massive redesign ✨

# [0.4.0](https://github.com/bamlab/flashlight/compare/v0.3.0...v0.4.0) (2023-04-26)

### Bug Fixes

- **aws:** create report destination folder if not existing ([923f9c2](https://github.com/bamlab/flashlight/commit/923f9c23c293104af79bb8594bd4deefab9fa03b))
- hotfix for flashlight measure ([66a7f89](https://github.com/bamlab/flashlight/commit/66a7f89a74f32c8159a30136e47b4c82b86b8f4a))
- **web:** ensure thread table displays white colors ([fbf03c6](https://github.com/bamlab/flashlight/commit/fbf03c6bc169ca87a5e8621057ef8a2abe087a60))

### Features

- **report:** support http video ([05044c4](https://github.com/bamlab/flashlight/commit/05044c4d90b6cca8de35d8a5737a920cc34e704f))
- **test:** add record bitRate and size option ([#97](https://github.com/bamlab/flashlight/issues/97)) ([364f58a](https://github.com/bamlab/flashlight/commit/364f58a973ad336e1e810b6c6b83c48c709c6ead))
- **web:** redesign charts and layout ([#96](https://github.com/bamlab/flashlight/issues/96)) ([d26d24a](https://github.com/bamlab/flashlight/commit/d26d24a045488002aa0f5e0c0c0be1ba674f04eb))
- **web:** redesign reports/add collapsible metrics explanation ([#94](https://github.com/bamlab/flashlight/issues/94)) ([bb08d0e](https://github.com/bamlab/flashlight/commit/bb08d0e045db33c2000dbd35f7e4450138657837))
- **web:** redesign reports/handle multiple reports ([#92](https://github.com/bamlab/flashlight/issues/92)) ([23e77a1](https://github.com/bamlab/flashlight/commit/23e77a1667757d11b17973be945a0f7bbdac358d))
- **web:** redesign reports/single card summary design ([#88](https://github.com/bamlab/flashlight/issues/88)) ([337c585](https://github.com/bamlab/flashlight/commit/337c585d1e72b55fd13e5acd0010f79fba43ffc2))

## [0.3.1](https://github.com/bamlab/flashlight/compare/v0.3.0...v0.3.1) (2023-04-26)

### Bug Fixes

- **aws:** create report destination folder if not existing ([923f9c2](https://github.com/bamlab/flashlight/commit/923f9c23c293104af79bb8594bd4deefab9fa03b))
- hotfix for flashlight measure ([66a7f89](https://github.com/bamlab/flashlight/commit/66a7f89a74f32c8159a30136e47b4c82b86b8f4a))
- **web:** ensure thread table displays white colors ([fbf03c6](https://github.com/bamlab/flashlight/commit/fbf03c6bc169ca87a5e8621057ef8a2abe087a60))

### Features

- **report:** support http video ([05044c4](https://github.com/bamlab/flashlight/commit/05044c4d90b6cca8de35d8a5737a920cc34e704f))
- **test:** add record bitRate and size option ([#97](https://github.com/bamlab/flashlight/issues/97)) ([364f58a](https://github.com/bamlab/flashlight/commit/364f58a973ad336e1e810b6c6b83c48c709c6ead))
- **web:** redesign charts and layout ([#96](https://github.com/bamlab/flashlight/issues/96)) ([d26d24a](https://github.com/bamlab/flashlight/commit/d26d24a045488002aa0f5e0c0c0be1ba674f04eb))
- **web:** redesign reports/add collapsible metrics explanation ([#94](https://github.com/bamlab/flashlight/issues/94)) ([bb08d0e](https://github.com/bamlab/flashlight/commit/bb08d0e045db33c2000dbd35f7e4450138657837))
- **web:** redesign reports/handle multiple reports ([#92](https://github.com/bamlab/flashlight/issues/92)) ([23e77a1](https://github.com/bamlab/flashlight/commit/23e77a1667757d11b17973be945a0f7bbdac358d))
- **web:** redesign reports/single card summary design ([#88](https://github.com/bamlab/flashlight/issues/88)) ([337c585](https://github.com/bamlab/flashlight/commit/337c585d1e72b55fd13e5acd0010f79fba43ffc2))

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
