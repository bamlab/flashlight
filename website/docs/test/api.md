# API

## `flashlight test`

Run a test several times and measure performance.

Main usage:
flashlight test --bundleId \<your app id\> --testCommand \<your test command\>

Example with Maestro:
flashlight test --bundleId com.example.app --testCommand "maestro test flow.yml"

## Options

| Option                                    | Description                                                                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| --testCommand \<testCommand\>             | Test command (e.g. `maestro test flow.yml`). App performance during execution of this script will be measured over several iterations.        |
| --bundleId \<bundleId\>                   | Bundle id of your app                                                                                                                         |
| --iterationCount \<iterationCount\>       | Amount of iterations to be run. Results will be averaged. (default: 10)                                                                       |
| --maxRetries \<maxRetries\>               | Maximum number of retries allowed over all iterations. (default: 3)                                                                           |
| --duration \<duration\>                   | Duration (in ms) is optional, but helps in getting consistent measures. Measures will be taken for this duration, regardless of test duration |
| --beforeEachCommand \<beforeEachCommand\> | Command to be run before each test iteration                                                                                                  |
| --afterEachCommand \<afterEachCommand\>   | Command to be run after each test iteration                                                                                                   |
| --beforeAllCommand \<beforeAllCommand\>   | Command to be run before all test iterations                                                                                                  |
| --resultsFilePath \<resultsFilePath\>     | Path where the JSON of results will be written                                                                                                |
| --resultsTitle \<resultsTitle\>           | Result title that is displayed at the top of the report                                                                                       |
| --record                                  | Allows you to record a video of the test. This is useful for debugging purposes.                                                              |
| --recordBitRate \<recordBitRate\>         | Value may be specified as bits or megabits, e.g. '4000000' is equivalent to '4M'.                                                             |
| --recordSize \<recordSize\>               | For best results, use a size supported by the AVC encoder.                                                                                    |
| --logLevel \<logLevel\>                   | Set Log level (choices: "error", "warn", "success", "info", "debug", "trace")                                                                 |
| -h, --help                                | display help for command                                                                                                                      |
