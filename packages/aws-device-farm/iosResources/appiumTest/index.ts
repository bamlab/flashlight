/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RemoteOptions, remote } from "webdriverio";

const capabilities = {
  /*
  platformName: "iOS",
  "appium:automationName": "XCUITest",
  "appium:xcodeOrgId": "Z445H6455F",
  "appium:xcodeSigningId": "iPhone Developer",
  "appium:bundleId": "org.reactjs.native.example.fakeStoreBam",
  "appium:udid": "00008020-001C48210CF3002E", //process.env.DEVICEFARM_DEVICE_UDID_FOR_APPIUM,
  "appium:deviceName": "iPhone de Developers (3) (16.1)", //process.env.DEVICEFARM_DEVICE_NAME,
  //"appium:platformVersion": process.env.DEVICEFARM_DEVICE_OS_VERSION,
  //"appium:app": process.env.DEVICEFARM_APP_PATH,
  */
};

const wdOpts: RemoteOptions = {
  hostname: "0.0.0.0",
  port: 4723,
  logLevel: "info",
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    const buttonItem = await driver.$('//XCUIElementTypeButton[@name="VIENS ON PETE TOUT"]');
    await buttonItem.click();
    const textButton = "ON A TOUT PETE";
    await driver.waitUntil(
      async () => {
        const text = await buttonItem.getText();
        return text === textButton;
      },
      { timeout: 5000, timeoutMsg: "Expected text to be different after 5s" }
    );
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
