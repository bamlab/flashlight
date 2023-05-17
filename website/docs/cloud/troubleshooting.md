---
sidebar_position: 20
---

# Troubleshooting

If your test have failed, you should receive an email with a video of the failed test.

## Make sure text matches your app content

If you see this message a few times, it means Flashlight wasn't able to find the text you passed in your app
```
Launch app "your.app.id"... ✅
Assert that ".*The text.*" is visible... ❌
```
Compare with the video of the failed test to make sure the app content was what you had expected.

## Run Maestro test locally 

Flashlight runs Maestro tests in the cloud, so if the test is failing and still can't figure out why, it could be useful to run it locally on a device.

See how to:
- [Install Maestro locally](https://maestro.mobile.dev/getting-started/installing-maestro) 
- and [run your test](https://maestro.mobile.dev/getting-started/writing-your-first-flow)

Since in the cloud, devices will have a blank state, it might be useful to clear data on your local device to reproduce the same behavior by adding a `clearState`(https://maestro.mobile.dev/api-reference/commands/clearstate) step,  e.g.:

```yaml
appId: your.app.id
---
- clearState
- launchApp
- tapOn: "Text on the screen"
```

## Still not working?

<Contact />
