---
sidebar_position: 1
---

# Getting started

[flashlight.dev](https://flashlight.dev) is now in open beta! 🥳   
With just a few clicks, you can get an app start performance score:  

## Get your app start performance score

### Step 1

Go to [app.flashlight.dev](https://app.flashlight.dev) and upload your APK 👇

<br />
<img width="1276" alt="image" src="https://github.com/bamlab/flashlight/assets/4534323/a5e2a176-2105-4de3-9e2b-180bc7ba7460" style={{border: "1px solid gray", borderRadius: 4 }} />
<br />
<br />
<br />


### Step 2

To get your TTI (time to interactive), make sure to fill this field:

<br />
<img width="798" alt="image" src="https://github.com/bamlab/flashlight/assets/4534323/f6ca2d12-2f54-44bd-a8ec-51dfce62868c" style={{border: "1px solid gray",  borderRadius: 4 }} />
<br />
<br />

Basically, Flashlight will be able to know that the app is started when this text appears.

:::tip
The text doesn't have to match your strings in its entirety.  
For example if "Hello world" appears in your app, you can just pass "world"
:::

### Step 3

After ~10min if there was no queue, you should receive your performance report by email 💯

In case of failure, you'll also receive a video, check the [troubleshooting section](./troubleshooting.md) to see common issues and how to deal with them.

## Download APK from Play Store

You can download a universal APK that Flashlight can install on any device from the [play store console](https://play.google.com/console) by:
- opening "App bundle explorer"
- clicking any app version
- on the "Downloads" tab, download the "Signed, universal APK"

![image](https://github.com/bamlab/flashlight/assets/4534323/4ab733cd-dc7f-497b-aaad-908a007717b2)

## Example

You can use one of our example APKs: [a small Twitter clone](https://github.com/bamlab/flashlight/blob/main/.github/workflows/twitter-clone-rn.apk)

The app looks like this when it has started, so you can just use "Dernier rappel" for the text field
<img width="452" alt="image" src="https://github.com/bamlab/flashlight/assets/4534323/55cd9fd8-e610-4c66-bb2d-3639d1b97ffd" />
