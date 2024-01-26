## 0.16.2 (2024-01-26)

### Features

- **Chart:** include series visibility ([#196](https://github.com/bamlab/flashlight/issues/196)) ([d435a31](https://github.com/bamlab/flashlight/commit/d435a316913edd71589bdcef308f5c4aee4951b9))

## 0.16.1 (2024-01-18)

### Bug Fixes

- **measure:** fix port option ([#192](https://github.com/bamlab/flashlight/issues/192)) ([1d8585f](https://github.com/bamlab/flashlight/commit/1d8585f099b91c944c6ea2741e7ca8ad9598c3b1))

# 0.16.0 (2024-01-17)

### Bug Fixes

- **measure:** UI buttons unresponsive/streamline socket URL handling ([#191](https://github.com/bamlab/flashlight/issues/191)) ([66b0899](https://github.com/bamlab/flashlight/commit/66b0899080ac3f7c4165db5925fb395396d0af7d))

## [0.15.1](https://github.com/bamlab/flashlight/compare/v0.15.0...v0.15.1) (2023-12-23)

# 0.15.0 (2023-12-23)

# [0.14.0](https://github.com/bamlab/flashlight/compare/v0.13.0...v0.14.0) (2023-12-08)

### Features

- **report:** add statistics in averaged summary ([#178](https://github.com/bamlab/flashlight/issues/178)) ([d718057](https://github.com/bamlab/flashlight/commit/d718057a5de4075ee060cf009addd191872ae2ff))

# [0.13.0](https://github.com/bamlab/flashlight/compare/v0.12.1...v0.13.0) (2023-11-29)

## [0.12.1](https://github.com/bamlab/flashlight/compare/v0.12.0...v0.12.1) (2023-11-24)

### Bug Fixes

- **measure:** fix taking multiple measures ([be80d07](https://github.com/bamlab/flashlight/commit/be80d079476b184f1412f79cf8450e8a395fac34))
- **measure:** support empty thread name ([52dce42](https://github.com/bamlab/flashlight/commit/52dce426108b0f79996891024a2f302570624596))

# [0.12.0](https://github.com/bamlab/flashlight/compare/v0.11.2...v0.12.0) (2023-11-08)

### Bug Fixes

- **report:** allow horizontal scrolling in threads table ([#168](https://github.com/bamlab/flashlight/issues/168)) ([0136567](https://github.com/bamlab/flashlight/commit/0136567f5baa2d7fe0365e9d01d174753c121a81))
- **report:** fix difference color for FPS ([#166](https://github.com/bamlab/flashlight/issues/166)) ([ae2dd98](https://github.com/bamlab/flashlight/commit/ae2dd98900dd36e756f3fc460d015e7d0be5e486))
- **report:** fix thread autoselection ([#169](https://github.com/bamlab/flashlight/issues/169)) ([eb28d01](https://github.com/bamlab/flashlight/commit/eb28d01af2dbb71afc08e3e7963b744486a370a6))

### Features

- **report:** add difference in comparison view ([#163](https://github.com/bamlab/flashlight/issues/163)) ([#164](https://github.com/bamlab/flashlight/issues/164)) ([ac4c3bf](https://github.com/bamlab/flashlight/commit/ac4c3bfff5a28cf458fe128b67e007b53f0ae97b))

## [0.11.1](https://github.com/bamlab/flashlight/compare/v0.10.1...v0.11.1) (2023-10-03)

### Bug Fixes

- **readme:** added install cmds ([#151](https://github.com/bamlab/flashlight/issues/151)) ([c48bc3b](https://github.com/bamlab/flashlight/commit/c48bc3b63a8e18aaa25698ed5f910f64b35ae1bf))
- **report:** fix iteration switching in failed report view ([#152](https://github.com/bamlab/flashlight/issues/152)) ([ff1a02c](https://github.com/bamlab/flashlight/commit/ff1a02cec3c63de7968a1f4c9597f7a9bcf59f68))
- **test:** fix Operation not supported on socket ([#157](https://github.com/bamlab/flashlight/issues/157)) ([9476fdd](https://github.com/bamlab/flashlight/commit/9476fdd3e89ad098e175a540abb9d2023277a57f))

### Features

- **ios:** have cpu usage per thread ios ([#150](https://github.com/bamlab/flashlight/issues/150)) ([ef2636c](https://github.com/bamlab/flashlight/commit/ef2636c8962efa2c2def0f7a5bb6d48969684238))
- **test:** add skipRestart option for quick testing ([d9c2ca4](https://github.com/bamlab/flashlight/commit/d9c2ca4dca2574e4f6db722472915341d985c63b))
- **tools:** add tools command ([#156](https://github.com/bamlab/flashlight/issues/156)) ([a981132](https://github.com/bamlab/flashlight/commit/a981132aaa13072fb48f7a1c7989e7d484f7ca6d))

## [0.10.1](https://github.com/bamlab/flashlight/compare/v0.10.0...v0.10.1) (2023-09-12)

### Bug Fixes

- fix tests that could timeout after an app crash ([#146](https://github.com/bamlab/flashlight/issues/146)) ([cbbe38e](https://github.com/bamlab/flashlight/commit/cbbe38e3517601d800f32767451dd5f9c97e5b3f))
- **profiler:** improve accuracy of CPU measures ([#140](https://github.com/bamlab/flashlight/issues/140)) ([5038cb7](https://github.com/bamlab/flashlight/commit/5038cb7704a551ca70ab67e1726bb6321d7f63b1))

# [0.10.0](https://github.com/bamlab/flashlight/compare/v0.8.0...v0.10.0) (2023-07-13)

### Bug Fixes

- **profiler:** fix no such file issue for apps with background processes ([#117](https://github.com/bamlab/flashlight/issues/117)) ([a3db43f](https://github.com/bamlab/flashlight/commit/a3db43f60beac4569dc7e96753497f26f7f8e605))

### Features

- **report:** make the video panel collapsible with animation ([#136](https://github.com/bamlab/flashlight/issues/136)) ([552b70d](https://github.com/bamlab/flashlight/commit/552b70d651b4e491801daebc5f6f6918478cd5d3))

# [0.9.0](https://github.com/bamlab/flashlight/compare/v0.8.0...v0.9.0) (2023-07-13)

### Bug Fixes

- **profiler:** add sigint to authorized exit codes ([3447a38](https://github.com/bamlab/flashlight/commit/3447a38b944fd99b3e91328b9bc022c8b387fc21))
- **profiler:** no such file /proc/{pid}/task ([#117](https://github.com/bamlab/flashlight/issues/117)) ([a3db43f](https://github.com/bamlab/flashlight/commit/a3db43f60beac4569dc7e96753497f26f7f8e605))

### Features

- make the video panel collapsible with animation ([#136](https://github.com/bamlab/flashlight/issues/136)) ([552b70d](https://github.com/bamlab/flashlight/commit/552b70d651b4e491801daebc5f6f6918478cd5d3))

# [0.9.0](https://github.com/bamlab/flashlight/compare/v0.8.0...v0.9.0) (2023-07-04)

# [0.8.0](https://github.com/bamlab/flashlight/compare/v0.7.3...v0.8.0) (2023-06-28)

### Features

- **measure:** measure in webapp without need for flipper ([#121](https://github.com/bamlab/flashlight/issues/121)) ([6f68b55](https://github.com/bamlab/flashlight/commit/6f68b55cfaccfd18273bec96a06e9fd38d9edc5d))
- **report** add danger and safe zone to charts ([#111](https://github.com/bamlab/flashlight/issues/111)) ([da0d803](https://github.com/bamlab/flashlight/commit/da0d8039b1cf5466d17ada104badaddbb72105ea))
- **aws:** ensure report gets deployed even for failed tests ([#126](https://github.com/bamlab/flashlight/issues/126)) ([53ebba8](https://github.com/bamlab/flashlight/commit/53ebba82a1d0aca24c27e7b0ca3012d2944e88d0))
- Filter retries on web reporter ([9d9f192](https://github.com/bamlab/flashlight/commit/9d9f1929b3b54bfae5951fca561dfe729e75b075))

### Bug Fixes

- **ESlint:** deactivate no require rule ([23abeeb](https://github.com/bamlab/flashlight/commit/23abeebacafd81d0a38e7f6a56d8cb73eb901740))
- **measure:** ensure we have only one socket connection between web and cli ([#130](https://github.com/bamlab/flashlight/issues/130)) ([4b59cd1](https://github.com/bamlab/flashlight/commit/4b59cd151bac7e04f050bb9410938bcfb233c088))
- **report** fix dropdown menu color ([#115](https://github.com/bamlab/flashlight/issues/115)) ([fd45757](https://github.com/bamlab/flashlight/commit/fd45757cfd4033841b4e86172037864e82131762))

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
