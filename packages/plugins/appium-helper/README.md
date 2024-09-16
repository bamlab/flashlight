# Appium Helper

Appium is a blackbox e2e testing framework, which means you can run it on any app (even production ones) with no setup required.

However, since it supports many languages and platforms, the docs can be difficult to navigate and find the precise way to do things. This package wraps a `webdriverio` client to expose most common e2e testing capabilities you would want to use.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
  - [Getting started](#getting-started)
  - [API](#api)
    - [Wait for element](#wait-for-element)
    - [Click element](#click-element)
    - [Scrolling](#scrolling)
    - [Start/Stop app](#startstop-app)
    - [Waiting](#waiting)
    - [Inputs](#inputs)
    - [Run any other webdriverio commands](#run-any-other-webdriverio-commands)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Getting started

1. Install the helper `yarn add @bam.tech/appium-helper`

2. Write your test script

```ts
// appium.test.ts
import { AppiumDriver } from "@bam.tech/appium-helper";

test("e2e", async () => {
  const driver = await AppiumDriver.create({
    // `npx @perf-profiler/profiler getCurrentApp` will display info for the current app
    appPackage: "com.example",
    appActivity: "com.example.MainActivity",
  });

  driver.startApp();
  await driver.findElementByText("Welcome");
});
```

3. Run the appium server `npx appium` in a terminal. If you just installed Appium, you may need to install a driver, e.g., by running `npx appium driver install uiautomator2`.
4. Run your test file in a separate terminal `yarn jest appium.test.ts`

### API

#### Wait for element

You can find an element by text or `testID`. The helper will wait for the element to exist and return it:

```ts
await driver.findElementByText("Welcome");
await driver.findElementById("welcome_text");
```

#### Click element

You can click an element by text or `testID`. The helper will wait for the element to exist and click it:

```ts
await driver.clickElementByText("Welcome");
await driver.clickElementById("welcome_text");
```

#### Scrolling

```ts
await driver.scrollDown();
await driver.scrollToEnd();
```

#### Start/Stop app

```ts
driver.startApp();
// You should probably add a finder to wait for the app to start
// for instance driver.findElementByText("Welcome");

driver.stopApp();
```

#### Waiting

You can also wait for a certain amount of time:

```ts
await driver.wait(<delay in ms>);
// e.g.
await driver.wait(5000);
```

#### Inputs

First find the element by its placeholder, value or test id, then use `addValue`:

```ts
const input = await driver.findElementByText("Email input Placeholder");
await input.addValue("My username");
```

#### Run any other webdriverio commands

`AppiumDriver` just wraps a [webdriverio](https://webdriver.io/) client.
You can still run any `webdriverio` commands using:

```ts
const client = driver.client;
// run any commands
await client.$("...");
```
