# Measure the performance of any iOS APP

This is the implementation of the Profiler for iOS app.
It uses [py-ios-device](https://github.com/YueChen-C/py-ios-device) to poll CPU, RAM and FPS data in real time.

This Profiler can only be used on real iOS devices.

In order to use it, you need to set an environment variable `PLATFORM=ios`

You can get the real time measure by running:
`PLATFORM=ios node packages/commands/measure/dist/server/bin.js measure`
