#!/bin/bash

APPID="org.reactjs.native.example.fakeStore"

# Get the UDID of an iPhone 11 simulator
UDID=$(xcrun simctl list devices | grep -m 1 'iPhone 14 (' | awk -F '[()]' '{print $2}')

# Boot the simulator
xcrun simctl boot $UDID

# Echo the UDID (for further use)
echo $UDID

# Install the app
xcrun simctl install $UDID ./.github/workflows/fakeStore.app

# Launch the app
xcrun simctl launch $UDID $APPID

mkdir -p report
npx flashlight-ios-poc ios-test --appId $APPID --simulatorId $UDID --testCommand 'maestro test ./packages/ios-poc/test.yaml' --resultsFilePath './report/result.json'