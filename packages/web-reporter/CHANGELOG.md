# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1-alpha.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.4.0...@perf-profiler/web-reporter@0.4.1-alpha.0) (2023-03-31)

**Note:** Version bump only for package @perf-profiler/web-reporter

# [0.4.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.3.2...@perf-profiler/web-reporter@0.4.0) (2023-02-06)

- feat!: prepare for standalone executable (#71) ([3d6aa79](https://github.com/bamlab/android-performance-profiler/commit/3d6aa797164e2b566db2c5b725475addd1f6d71c)), closes [#71](https://github.com/bamlab/android-performance-profiler/issues/71)

### BREAKING CHANGES

- commands have additional prefix, see readme for changes

- chore: ensure standalone executable work with c++ binaries

- chore(web): put report in tmp dir by default

This is especially important for the standalone executable

- docs: revamp docs with docusaurus

## [0.3.2](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.3.1...@perf-profiler/web-reporter@0.3.2) (2023-01-27)

**Note:** Version bump only for package @perf-profiler/web-reporter

## [0.3.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.3.0...@perf-profiler/web-reporter@0.3.1) (2022-12-15)

**Note:** Version bump only for package @perf-profiler/web-reporter

# [0.3.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.2.4...@perf-profiler/web-reporter@0.3.0) (2022-11-03)

### Features

- **web-reporter:** add ability to set time interval to 'cut' measures ([cc506b5](https://github.com/bamlab/android-performance-profiler/commit/cc506b5ffd3112ad5dbebee69f2a455018a55254))

## [0.2.4](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.2.3...@perf-profiler/web-reporter@0.2.4) (2022-10-14)

**Note:** Version bump only for package @perf-profiler/web-reporter

## [0.2.3](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.2.2...@perf-profiler/web-reporter@0.2.3) (2022-10-13)

**Note:** Version bump only for package @perf-profiler/web-reporter

## [0.2.2](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/web-reporter@0.2.1...@perf-profiler/web-reporter@0.2.2) (2022-09-19)

### Bug Fixes

- **web-reporter:** don't fail if open command doesn't exist ([#26](https://github.com/bamlab/android-performance-profiler/issues/26)) ([4b83771](https://github.com/bamlab/android-performance-profiler/commit/4b83771c916da8b433222a6376b6b1180edfc42d))

## 0.2.1 (2022-09-13)

### Bug Fixes

- **web-reporter:** fix running web-reporter with absolute path ([#24](https://github.com/bamlab/android-performance-profiler/issues/24)) ([f3d93ea](https://github.com/bamlab/android-performance-profiler/commit/f3d93ea76163009b569885b7a93bbb7c620c2901))

# 0.2.0 (2022-09-07)

# 0.1.0 (2022-08-30)

# 0.1.0-alpha.9 (2022-08-29)

# 0.1.0-alpha.8 (2022-08-27)

# 0.1.0-alpha.7 (2022-08-12)

### Features

- **flipper:** prepare new version ([#9](https://github.com/bamlab/android-performance-profiler/issues/9)) ([4d97516](https://github.com/bamlab/android-performance-profiler/commit/4d97516f9a0b8f1715c0b22c1bdab70fb32cc527))
- **web-reporter:** add destination option ([#10](https://github.com/bamlab/android-performance-profiler/issues/10)) ([5fd36ab](https://github.com/bamlab/android-performance-profiler/commit/5fd36abcb5df7966032c49ccddc1410c769f856d))

# 0.1.0-alpha.6 (2022-08-12)

# 0.1.0-alpha.5 (2022-08-12)

### Features

- **web-reporter:** open all measures in a folder ([#7](https://github.com/bamlab/android-performance-profiler/issues/7)) ([7cae1af](https://github.com/bamlab/android-performance-profiler/commit/7cae1af2a9639e2ff8d86275f17d71e2aad1a7d2))

# 0.1.0-alpha.4 (2022-08-08)

### Features

- add ability to pass custom score calculation ([#6](https://github.com/bamlab/android-performance-profiler/issues/6)) ([4011ee5](https://github.com/bamlab/android-performance-profiler/commit/4011ee59dfd1b51530974cfaea6a60873e5699fc))

# 0.1.0-alpha.3 (2022-08-04)

### Bug Fixes

- fix flipper plugin ([6035938](https://github.com/bamlab/android-performance-profiler/commit/6035938f8f0bcad14a32498babbf6a0ffacea607))

### Features

- add comparison view ([02c5918](https://github.com/bamlab/android-performance-profiler/commit/02c5918378d43eb245cc7ca880025926d87ca306))
- add script to open html report ([3362ba4](https://github.com/bamlab/android-performance-profiler/commit/3362ba46b351ebb9d7492a495d9c38fb5623c755))
- add web reporter with sample measure ([5fca9b7](https://github.com/bamlab/android-performance-profiler/commit/5fca9b702fffe2248c6def10d94671c7bcbeb553))
- average iterations in report ([b421dc8](https://github.com/bamlab/android-performance-profiler/commit/b421dc8b0fe4a937988906c947d648f1ecae2c69))
- build better comparison view ([6228ab4](https://github.com/bamlab/android-performance-profiler/commit/6228ab4f1e5eca6e557f69402bb81963bb270dfd))
