# Flashlight on iOS POC

Requirements:

- `maestro` installed
- `node` installed

## Steps

- Get a running simulator id with `xcrun simctl list devices`
- Create template Flashlight in Xcode Instruments (with cpu-profile and memory usage)
- Add your own test in `test.yaml`
- `flashlight-ios-poc ios-test --appId <YOUR_APP_ID> --simulatorId 9F852910-03AD-495A-8E16-7356B764284 --testCommand "maestro test test.yaml" --resultsFilePath "./result.json"`

- Check the results in the web-reporter
  `yarn workspace @perf-profiler/web-reporter build`
- `node packages/web-reporter/dist/openReport.js report result.json`

## Next steps

- submit PR and publish report command
- auto creation template flashlight (in xcode instruments)
- run several iterations
- add more metrics (RAM, FPS, CPU per thread)
- Unify API with flashlight test
