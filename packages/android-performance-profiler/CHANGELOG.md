# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/profiler@0.4.0...@perf-profiler/profiler@0.4.1) (2022-11-03)

### Bug Fixes

- **profiler:** ensure fps > 0 ([13c8c7b](https://github.com/bamlab/android-performance-profiler/commit/13c8c7b3abc52bd88b1c0db10c835680a49df9f1))

# [0.4.0](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/profiler@0.3.2...@perf-profiler/profiler@0.4.0) (2022-10-28)

### Features

- **cppProfiler:** throw an error if SDK version is less than 24 (Android 7) ([#40](https://github.com/bamlab/android-performance-profiler/issues/40)) ([ba5a880](https://github.com/bamlab/android-performance-profiler/commit/ba5a880d3aba0ee2691e91323bb37912bc22a444))
- **profiler:** prepare for flipper plugin publish ([#42](https://github.com/bamlab/android-performance-profiler/issues/42)) ([43e97e3](https://github.com/bamlab/android-performance-profiler/commit/43e97e380e51ea5d50c2515e16079f7a9caab8eb))

## [0.3.2](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/profiler@0.3.1...@perf-profiler/profiler@0.3.2) (2022-10-13)

**Note:** Version bump only for package @perf-profiler/profiler

## [0.3.1](https://github.com/bamlab/android-performance-profiler/compare/@perf-profiler/profiler@0.3.0...@perf-profiler/profiler@0.3.1) (2022-09-27)

### Bug Fixes

- **profiler:** fix bundle id option in profile command ([595060d](https://github.com/bamlab/android-performance-profiler/commit/595060d513073d06489ae2ebd0bcca25e546a7e2))

# 0.3.0 (2022-09-27)

### Features

- **profiler:** improve fps accuracy by using atrace for reporting ([#28](https://github.com/bamlab/android-performance-profiler/issues/28)) ([ad161d5](https://github.com/bamlab/android-performance-profiler/commit/ad161d53b6d219242641e33e5d1f8214ad0f5f6c))

# 0.2.0 (2022-09-07)

### Bug Fixes

- **profiler:** detect appActivity when command output doesn't contain "$" ([6332d7b](https://github.com/bamlab/android-performance-profiler/commit/6332d7bd2e0504254f22f014d8764d2d8b6508d0))

### Features

- **profiler:** replace bundle id by "UI Thread" in CPU measures ([0653a46](https://github.com/bamlab/android-performance-profiler/commit/0653a461cd1a18f1202e9189e22518cda5f84637))

# 0.1.0 (2022-08-30)

# 0.1.0-alpha.9 (2022-08-29)

# 0.1.0-alpha.8 (2022-08-27)

### Features

- **profiler:** add c++ version ([4c56697](https://github.com/bamlab/android-performance-profiler/commit/4c566973cfe4ea0f23eed3109dfb8ca66e5b0001))
- **profiler:** add command to print app activity ([1d81cde](https://github.com/bamlab/android-performance-profiler/commit/1d81cdebce370b020359173ba834f0dd81d8da80))
- **profiler:** add spawn function ([e6eba2e](https://github.com/bamlab/android-performance-profiler/commit/e6eba2e88d9621fd096fc3f3b56614b46b9ca781))
- **profiler:** add ts file to interface with c++ profiler ([57c7bb2](https://github.com/bamlab/android-performance-profiler/commit/57c7bb26061b24814d5779ff841b11193fc2355f))
- **profiler:** add useful commands ([a7c5dba](https://github.com/bamlab/android-performance-profiler/commit/a7c5dbab2f00c387a595eefc50f6c1832c60271c))
- **profiler:** always ensure c++ profiler is installed ([1982760](https://github.com/bamlab/android-performance-profiler/commit/1982760b638d3b59b919c15ee8d30ef40bbc5637))
- **profiler:** replace with cpp profiling ([1e85b84](https://github.com/bamlab/android-performance-profiler/commit/1e85b8499aa1c2fa166cd3296ce62f6dbbf8f9e4))

# 0.1.0-alpha.7 (2022-08-12)

# 0.1.0-alpha.6 (2022-08-12)

# 0.1.0-alpha.5 (2022-08-12)

# 0.1.0-alpha.4 (2022-08-08)

### Features

- **fps:** auto enable debug.hwui.profile ([12a4042](https://github.com/bamlab/android-performance-profiler/commit/12a40429ce1fa137a99c417b97b572935d1ea158))

# 0.1.0-alpha.3 (2022-08-04)

### Bug Fixes

- **fps:** take idle frames into account ([125e2e2](https://github.com/bamlab/android-performance-profiler/commit/125e2e219f28ee8efb275fc671b2c8e9d620c39c))

### Features

- add FPS poc ([6fe3398](https://github.com/bamlab/android-performance-profiler/commit/6fe33981db9cfd45bae8d9db7973cff7286d394c))
- add ram usage ([1f1515a](https://github.com/bamlab/android-performance-profiler/commit/1f1515a9e5f6cc9093892703cda6c9e21781aae0))
- add some gfxinfo parsing ([f365604](https://github.com/bamlab/android-performance-profiler/commit/f365604d51f5f6ff018b9cab43c2ac5271a61488))
- build better comparison view ([6228ab4](https://github.com/bamlab/android-performance-profiler/commit/6228ab4f1e5eca6e557f69402bb81963bb270dfd))
- improve execLoopCommands ([3d0c78a](https://github.com/bamlab/android-performance-profiler/commit/3d0c78a0887f14863fcd7ef9e903f64759852149))
- introducing flipper-plugin-android-performance-profiler ([dc18a3c](https://github.com/bamlab/android-performance-profiler/commit/dc18a3ce83df792ebb32901fb1236f011d3cd10f))
- measure fps ([b643918](https://github.com/bamlab/android-performance-profiler/commit/b64391823f3ff1cf32770791ba24ec6fe174afa9))

### Performance Improvements

- improve reporting time accuracy ([fb0ea48](https://github.com/bamlab/android-performance-profiler/commit/fb0ea481bfaf9624cdfc783004400cb5cfc3b9ad))
