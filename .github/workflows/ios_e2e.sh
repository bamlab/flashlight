#!/bin/bash

brew tap facebook/fb
brew install facebook/fb/idb-companion

git clone https://github.com/bamlab/maestro.git
cd maestro
git checkout feat/prevent-driver-uninstall-ios
git submodule update --init
./gradlew distZip && unzip -o maestro-cli/build/distributions/maestro.zip -d dist
cd ..

export PATH=$PATH:$(pwd)/maestro/dist/maestro/bin

yarn tsc --build && yarn workspace @perf-profiler/web-reporter build
npx link-lerna-package-binaries

APPID="org.reactjs.native.example.fakeStore"

# Get the UDID of an iPhone 11 simulator
UDID=$(xcrun simctl list devices | grep -m 1 'iPhone 14 (' | awk -F '[()]' '{print $2}')

# Boot the simulator
xcrun simctl boot $UDID

# Echo the UDID (for further use)
echo $UDID

# Install the app
xcrun simctl install $UDID ./.github/workflows/fakeStore.app

(maestro initDriver && sleep 50) || maestro initDriver

# Launch the app
# xcrun simctl launch $UDID $APPID

mkdir -p report
npx flashlight-ios-poc ios-test --appId $APPID --simulatorId $UDID --testCommand 'maestro test ./packages/ios-poc/test.yaml' --resultsFilePath './report/result.json'