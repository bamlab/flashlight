# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.10.2](https://github.com/bamlab/flashlight/compare/@perf-profiler/aws-device-farm@0.10.1...@perf-profiler/aws-device-farm@0.10.2) (2024-09-30)

### Bug Fixes

- **appium:** update client and CI to appium v2 ([#318](https://github.com/bamlab/flashlight/issues/318)) ([bba3ca2](https://github.com/bamlab/flashlight/commit/bba3ca297d2fc85c916a2036d4cbc70d7a02af4e))

## [0.10.1](https://github.com/bamlab/flashlight/compare/@perf-profiler/aws-device-farm@0.10.0...@perf-profiler/aws-device-farm@0.10.1) (2024-06-04)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

# [0.10.0](https://github.com/bamlab/flashlight/compare/@perf-profiler/aws-device-farm@0.9.5...@perf-profiler/aws-device-farm@0.10.0) (2024-03-01)

### Bug Fixes

- **aws:** add a testPackageArn option for prepublished package ([#176](https://github.com/bamlab/flashlight/issues/176)) ([e4c9f40](https://github.com/bamlab/flashlight/commit/e4c9f40cfe113f8fbde48b7903d4ca70de77f042))
- fix graph curviness bugs by upgrading apex ([#204](https://github.com/bamlab/flashlight/issues/204)) ([0223202](https://github.com/bamlab/flashlight/commit/0223202301f58fc656e5c6e826bb61d80d899568))

### Features

- **tools:** add tools command ([#156](https://github.com/bamlab/flashlight/issues/156)) ([a981132](https://github.com/bamlab/flashlight/commit/a981132aaa13072fb48f7a1c7989e7d484f7ca6d))

## [0.9.5](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.9.4...@perf-profiler/aws-device-farm@0.9.5) (2023-09-14)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

## [0.9.4](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.9.3...@perf-profiler/aws-device-farm@0.9.4) (2023-08-18)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

## [0.9.3](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.9.2...@perf-profiler/aws-device-farm@0.9.3) (2023-07-31)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

## [0.9.2](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.9.1...@perf-profiler/aws-device-farm@0.9.2) (2023-07-31)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

## [0.9.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.9.0...@perf-profiler/aws-device-farm@0.9.1) (2023-07-31)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

# [0.9.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.8.1...@perf-profiler/aws-device-farm@0.9.0) (2023-06-28)

### Features

- **aws:** ensure report gets deployed even for failed tests ([#126](https://github.com/bamlab/android-performance-profiler/issues/126)) ([53ebba8](https://github.com/bamlab/android-performance-profiler/commit/53ebba82a1d0aca24c27e7b0ca3012d2944e88d0))

## [0.8.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.8.0...@perf-profiler/aws-device-farm@0.8.1) (2023-05-25)

**Note:** Version bump only for package @perf-profiler/aws-device-farm

# [0.8.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.7.1...@perf-profiler/aws-device-farm@0.8.0) (2023-04-26)

### Features

- **test:** add record bitRate and size option ([#97](https://github.com/bamlab/android-performance-profiler/issues/97)) ([364f58a](https://github.com/bamlab/android-performance-profiler/commit/364f58a973ad336e1e810b6c6b83c48c709c6ead))

## [0.7.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.7.0...@perf-profiler/aws-device-farm@0.7.1) (2023-04-25)

### Bug Fixes

- **aws:** create report destination folder if not existing ([923f9c2](https://github.com/bamlab/android-performance-profiler/commit/923f9c23c293104af79bb8594bd4deefab9fa03b))

# [0.7.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.6.0...@perf-profiler/aws-device-farm@0.7.0) (2023-04-18)

### Features

- add --record options to have videos in report ([#86](https://github.com/bamlab/android-performance-profiler/issues/86)) ([2094d38](https://github.com/bamlab/android-performance-profiler/commit/2094d38845a8e96696fea94e91a91cc9f174931d))

# [0.6.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.5.1...@perf-profiler/aws-device-farm@0.6.0) (2022-12-05)

### Features

- **aws:** provide nicer way to build yml spec files ([54d896f](https://github.com/bamlab/android-performance-profiler/commit/54d896f2166aae4662d19ce4569d0c105ee84f29))

### BREAKING CHANGES

- **aws:** if using `testCommand` option instead of `testFile`, you are now required to pass `testFolder`. `.` was the default

## [0.5.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.5.0...@perf-profiler/aws-device-farm@0.5.1) (2022-11-28)

### Bug Fixes

- **aws:** fix issue when reportDestinationPath contains space ([#56](https://github.com/bamlab/android-performance-profiler/issues/56)) ([330c4c1](https://github.com/bamlab/android-performance-profiler/commit/330c4c1d7137d85fa7ac6f1b2a6ea51569f1f9e4))

# [0.5.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.4.0...@perf-profiler/aws-device-farm@0.5.0) (2022-10-28)

### Bug Fixes

- **aws:** throw if upload has failed ([ac59072](https://github.com/bamlab/android-performance-profiler/commit/ac5907227b30ff353f5d7f28c54e78d9d62a8351))

### Features

- **aws:** add postTestCommand option ([#44](https://github.com/bamlab/android-performance-profiler/issues/44)) ([133e3e6](https://github.com/bamlab/android-performance-profiler/commit/133e3e64c9dea3d602e0755bf5a1a162cdcc2397))
- **aws:** improve compatibility with certain envs like AWS Lambda ([#43](https://github.com/bamlab/android-performance-profiler/issues/43)) ([c8597be](https://github.com/bamlab/android-performance-profiler/commit/c8597be91ca19d51a47d2466aead8bb51fbdbc05))

# [0.4.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/aws-device-farm@0.3.0...@perf-profiler/aws-device-farm@0.4.0) (2022-10-13)

### Features

- **aws:** add simplified usage ([865435e](https://github.com/bamlab/android-performance-profiler/commit/865435e35540a108a4af9c47e124b25819f05df2))
- **aws:** add uploadApk command ([2fb058b](https://github.com/bamlab/android-performance-profiler/commit/2fb058bd204526f48e63b7a25211309228b8740e))

# 0.3.0 (2022-09-14)

### Features

- **aws:** add progress indicator for uploads ([#25](https://github.com/bamlab/android-performance-profiler/issues/25)) ([ba86182](https://github.com/bamlab/android-performance-profiler/commit/ba8618260c0662bc6581123b123ac6418c020ccf))

# 0.2.0 (2022-09-07)

# 0.1.0 (2022-08-30)

# 0.1.0-alpha.10 (2022-08-30)

### Bug Fixes

- **aws:** use same env naming as cli ([72488dd](https://github.com/bamlab/android-performance-profiler/commit/72488dd4c1846cc9fe406699ae7efc0483276de3))

# 0.1.0-alpha.9 (2022-08-29)

### Features

- **aws:** add more features to device farm ([b81916b](https://github.com/bamlab/android-performance-profiler/commit/b81916bab7b3e1df67c8f21383f294d6fc571c50))

# 0.1.0-alpha.8 (2022-08-27)

### Features

- **ci:** add e2e test in aws device farm ([e6d7948](https://github.com/bamlab/android-performance-profiler/commit/e6d79489a938ed3dc059288c3b90d28a331fb6a6))
