# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.0.0-alpha.0 (2024-06-04)

### Bug Fixes

- **profiler:** improve accuracy of CPU measures ([#140](https://github.com/bamlab/flashlight/issues/140)) ([5038cb7](https://github.com/bamlab/flashlight/commit/5038cb7704a551ca70ab67e1726bb6321d7f63b1))
- **profiler:** improve timings accuracy ([#84](https://github.com/bamlab/flashlight/issues/84)) ([1908689](https://github.com/bamlab/flashlight/commit/19086891b618382dd290431e63cf72059a729133))

### Features

- add --record options to have videos in report ([#86](https://github.com/bamlab/flashlight/issues/86)) ([2094d38](https://github.com/bamlab/flashlight/commit/2094d38845a8e96696fea94e91a91cc9f174931d))
- **report:** make RN and Flutter threads stand out nicely ([#205](https://github.com/bamlab/flashlight/issues/205)) ([0e99a27](https://github.com/bamlab/flashlight/commit/0e99a2780c00fad342b2a13189a2adee51e5dd9c))

### BREAKING CHANGES

- **profiler:** if using a custom script, pollPerformanceMeasures will now take `{ onMeasure: (Measure) => void }` as second parameter
