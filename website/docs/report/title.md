# Setting a title

You can change the title displayed in the web report by passing `--resultsTitle` to the `test` or the `measure` command:

```sh
flashlight test --bundleId com.twitter.android \
 --testCommand "maestro test twitter.yaml` \
 --resultsTitle "Twitter - App start"
```
