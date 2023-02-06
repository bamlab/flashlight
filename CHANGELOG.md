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
