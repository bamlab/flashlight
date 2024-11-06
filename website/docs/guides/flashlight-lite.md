---
slug: /guides/flashlight-lite
---

# 🤓 Recoding Flashlight

On Android, we already have many tools to measure the performance of apps. But can we measure the performance of production apps, without installing any SDKs in the app? As we'll see, Android is based on Linux, so that gives us a lot of power.

## The power of ADB 🧙

On Android, you can use ADB (Android Debug Bridge) to control your Android device from your computer.
You can for instance install apps with `adb install`, or even run some events: for instance I can use `adb shell input text Bonjour` to directly type some text.

What's interesting in that last command is the use of `adb shell`. `adb shell` opens a new shell directly on your Android device.  
This means that if you run `echo Bonjour` in that shell, your Android device is actually running the prompt!

<img width="373" alt="adb shell echo BONJOUR prints bonjour on the device" src="https://github.com/user-attachments/assets/d905d7b0-ecb2-4d69-9037-d6d633db665c" />
<br /><br />

To double-check that I can run `uname` on my computer (running macOS) and in the `adb shell`:

<img width="256" alt="uname shows Darwin on my mac but Linux in the adb shell" src="https://github.com/user-attachments/assets/ef2583d4-abe3-4a0c-984c-b61daf879a7a" />
<br /><br />

:::tip
Instead of running `adb shell` and then running a command, we can directly type `adb shell <command>` instead.  
For instance `adb shell echo Bonjour`.
:::

### What about performance?

Since Android is based on Linux, we can start to think about all the performance tools available out of the box on Linux systems.

How about `top`? On my Mac, I can run `top` in the terminal and I see a lot of performance stats about the apps I'm using.

<Video url="https://github.com/user-attachments/assets/51260727-f3cc-47cb-a24e-344505197616" />
<br /><br />

For instance iTerm was the app consuming the more CPU power when I ran `top` in the video above.

Does it work with Android? Let's find out by running `adb shell top`.
_Actually, let's add a `-d 1` to display values every 1sec._

<Video url="https://github.com/user-attachments/assets/8c3df336-22da-468d-8dfb-ec74c877724a" />
<br /><br />

It works! 🥳 At the top, I see that the app consuming the most CPU power is named `com.twitter.and+`. Sounds like an app you know? Yup, I was scrolling in the Twitter app while running `top`.

<img width="867" alt="image" src="https://github.com/user-attachments/assets/a7e6ae15-f945-4a84-99cb-e1dbf6ad1f40" />
<br /><br />

I don't have access to Twitter's source code, and yet quite easily, I'm able to measure its performance! 🥳

:::info Exceeding 100%?
CPU consumption reported in top can exceed 100%, because each CPU core accounts for 100%.
For instance, my Pixel 8 has 9 cores, so the max CPU consumption reported would be 900%.
:::

### Going thread by thread

To have more granularity, it'd be nice to have a thread by thread consumption breakdown.

:::tip
This is particularly useful for React Native apps for instance, where you need to make sure the JS thread is not running at 100% to still be able to handle events.
:::

We can have thread by thread info by passing the `-H` option. Easy to remember, right? It's H like ... hum ... H like threads? 🤷
I was puzzled by the naming, but it actually stands for **Hardware threads**.  
Anyway, let's try running `adb shell top -d 1 -H`:

<Video url="https://github.com/user-attachments/assets/0806cc5e-143e-41d2-a9e1-810c13869f01" />
<br /><br />

This time, I tested with a Bluesky, a React Native app. We can now see a breakdown of all the threads on the device (not just Bluesky), but we can figure out what the top 6 threads are about on the image below:

<img width="864" alt="result of top -H showing JS thread and some other well known threads" src="https://github.com/user-attachments/assets/784e458b-6867-48b9-8b99-9a75fb160c20" />
<br /><br />

- `mqt_js`: JS thread used by React Native apps
- `.blueskyweb.app`: Android UI thread.  
  You'll see it in every Android app.
  It has the same name as the app id, except it's truncated to 16 characters since that's the max process name length in Linux.
- `RenderThread`: also a thread you'll see in every app.  
  Simply put, it handles communication between the UI thread and the GPU.
- `top`, yep that's the `top` command we were running. More on that below.
- `mqt_native_modules`: a thread typical in RN app using the old RN architecture
- `glide-disk-cach`: a thread related to Glide, an Android library to display image.

:::info
The threads used by an app can actually reveal a lot about how the technology they use!  
Without knowing anything about the Bluesky app, you can guess it's a React Native using the old architecture, and using the Glide library to display images.
:::

### Limitations

To measure CPU consumption, it would seem we have everything we need! We can measure thread by thread, even for production apps, without needing to install a particular SDK.

However a few caveats:

- ⚠️ `top` cannot display measures more often than 1s. We can't display every 500ms for instance.
- 🚨 `top` in itself actually consumes a lot of CPU!  
  I was using a Pixel 8 for the previous videos (not a bad phone) and already needed ~25% CPU power to run it. My tests with lower end Android phones or even TVs had it reach almost 100% several times!

:::warning
You need to be wary of the performance of your performance measuring tool itself! 🤯  
**Performance tools have an impact on the performance of your device** and sometimes on your app!

Android Studio profiling for instance can slow down your app or increase its memory footprint.
:::

Let's see if we can go beyond `top` and write a tool that has minimal impact on the device 💪

## Recoding CPU measures

### Have you ever opened the Android source code?

Wanna know how `top` is implemented on Android? Well we can just clone or search the Android source code from the [source web site](https://source.android.com/)

I don't know if you've ever done this, but when I interact with a codebase I don't know, to search for the code of a specific feature, I like to search for some wording 😅

So here, let's search for some wording contained inside `adb shell top --help` and let's see if we're lucky 🤞, for instance `Usage graphs instead of text`

![Searching inside Android code source](https://github.com/user-attachments/assets/625437ae-852c-4347-a68d-9920acba92cd)

`ps.c` sounds like a good candidate for a file containing the implementation for `top`:

- it's a C file
- it's named `ps` which is another tool to get performance measures on Linux
- it's in a `toybox` folder. A quick Google search lets me know `toybox` is a set of open source implementation of utilities such as `ls`, `mv` and ... `top`!

:::tip
The code is still quite massive and tricky to understand, especially if you have no C/C++ experience.  
However, this is a good use case to get AI to explain what a complex code is doing!
:::

Sadly I didn't have GenAI at the time of writing Flashlight, likely you could just ask "how to measure CPU consumption on Android with adb" and it would give you the solution directly 😅  
But where's the fun in that? 😁

Still, we can apply a bit of guesswork. Likely, `top_main` is the function that we want, and it calls `top_common` directly:

<img width="644" alt="top_main" src="https://github.com/user-attachments/assets/a77ce1ec-0ef0-47b1-9ec8-b702522f971c" />
<br /><br />

`top_common` seems to be doing a lot of things! However these 2 lines seem interesting! There's some mention of threads, and look: we find the `-H` flag we were passing!

<img width="617" alt="top_common" src="https://github.com/user-attachments/assets/cad21b71-cda3-4726-9d5e-19775871c4fb" />
<br /><br />

So with `dirtree_flagread`, we're going through the `/proc` folder, and with the `-H` flag we're applying the `get_threads` function.  
So let's look at the `get_threads` function:

<img width="657" alt="image" src="https://github.com/user-attachments/assets/789fd721-2964-46d3-abdb-754c1eae2aaa" />
<br /><br />

For each subfolder of `/proc`, we're going through the `task` folder and applying the `get_ps` function.

Searching for `get_ps` in the file, we can cheat a little bit because it's well documented!

<img width="665" alt="image" src="https://github.com/user-attachments/assets/1fbdc102-980a-4ad3-bd3a-12de6f58447a" />

Basically it reads a lot of data from the `/stat` file. A quick Google search about "proc stat" reveals from the [Linux documentation](https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html) that this file does hold CPU stats for every process!

### Let's wrap up, what do we need to implement?

- in the `/proc` folder, we find several folder.  
  Basically it's one folder for each process, so each app will have its own folder there. They're numeral folders, based on the process id, or pid.
- in `/proc/<PID>/task`, we seem to find all the threads for the app in subfolders, each have their own thread process id
- in `/proc/<PID>/task/<Thread PID>/stat`, we have all the CPU stats for a given thread
- based on the [Linux documentation](https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html), we're interested in the 14th and 15th column

<img width="729" alt="image" src="https://github.com/user-attachments/assets/90295442-2d4d-462e-a6f3-db1c7101fd75" />

### Let's code this!

This is demonstrated in [this Kotlin repository](https://github.com/Almouro/flashlight-lite).  
More details will be added to this page in the near future!

## Recoding FPS

This is demonstrated in [this Kotlin repository](https://github.com/Almouro/flashlight-lite).  
More details will be added to this page in the near future!
