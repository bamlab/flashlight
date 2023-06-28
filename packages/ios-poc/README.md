# Flashlight on iOS POC

Requirements:

- `maestro` installed

## Steps

- Run `yarn` and `yarn watch` at the root
- Create template Flashlight in Xcode Instruments (with cpu-profile and memory usage)
- Fill in `app_id` and `simulator_id` in `ios.sh`
- Change the `app_id` in both `launch.yaml` and `test.yaml`
- Start the device
- Run

```bash
./ios.sh
```

- Check the results in the web-reporter
  `yarn workspace @perf-profiler/web-reporter start`

## Next steps

- ensure we don't break (comme des shlags) `report` command, for now we'll add a flag `if (process.env.EXPERIMENTAL_IOS_REPORT)` to use the ios version of the report
- rewrite ios.sh in TS
