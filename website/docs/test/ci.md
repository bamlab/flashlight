---
sidebar_position: 10
---

# Running in CI

To run in CI, you'll need the CI to be connected to an Android device. An emulator running on the CI will likely be too slow, so it's best to be connected to a device farm cloud. The profiler needs full `adb` access, so only few device cloud are compatible:

- [AWS Device Farm](https://aws.amazon.com/device-farm/pricing/)
- Saucelabs with Entreprise plan and [Virtual USB](https://docs.saucelabs.com/mobile-apps/features/virtual-usb/)
- [Genymotion Cloud](https://www.genymotion.com/pricing/) (using emulators will not accurately reproduce the performance of a real device)

Our own cloud version will be publicly available soon! If you'd like to participate in the private beta, register on [https://flashlight.dev](https://flashlight.dev)