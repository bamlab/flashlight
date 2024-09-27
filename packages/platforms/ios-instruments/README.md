# Flashlight on iOS POC

Requirements:

- `maestro` installed
- `node` installed
- `idb` installed

## Steps

PLATFORM=ios-instruments node packages/commands/test/dist/bin.js test --bundleId <YOUR_APP_ID> --testCommand "maestro test test.yaml" --resultsFilePath "./result.json"`

- Check the results in the web-reporter
  `yarn workspace @perf-profiler/web-reporter build`
- `node packages/commands/report/dist/openReport.js report result.json`

## Next steps

- run several iterations
- add more metrics (RAM, FPS)
- Unify API with flashlight test
