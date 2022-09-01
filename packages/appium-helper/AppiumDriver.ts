import * as webdriver from "webdriverio";
import { Logger } from "@perf-profiler/logger";
import { GestureHandler } from "./GestureHandler";
import { execSync } from "child_process";

const executeCommand = (command: string): string => {
  return execSync(command).toString();
};

const TEN_MINUTES = 600000;

// Allow tests to take as much time as needed, in any case Bitrise will kill the test if it hangs
const A_LOT_OF_TIME = 10 * TEN_MINUTES;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (global.test) {
  jest.setTimeout(A_LOT_OF_TIME);
}

export class AppiumDriver {
  client: webdriver.BrowserObject;
  gestures: GestureHandler;
  timeout: number;
  bundleId: string;
  appActivity: string;

  constructor({
    client,
    bundleId,
    appActivity,
  }: {
    client: webdriver.BrowserObject;
    bundleId: string;
    appActivity: string;
  }) {
    this.client = client;
    this.timeout = 30000;
    this.gestures = new GestureHandler(client);
    this.bundleId = bundleId;
    this.appActivity = appActivity;
  }

  static async create({
    appPackage,
    appActivity,
    hostName,
    ...clientCapabilities
  }: webdriver.BrowserObject["capabilities"] & {
    appPackage: string;
    appActivity: string;
    hostName?: string;
  }) {
    const capabilities = {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      appPackage,
      // See https://github.com/appium/appium/blob/1e30207ec4e413c64396420fbb0388392e88cc54/docs/en/writing-running-appium/other/reset-strategies.md
      "appium:noReset": true,
      autoLaunch: false,
      appActivity,
      newCommandTimeout: TEN_MINUTES,
      ...clientCapabilities,
    };

    const client = await webdriver.remote({
      path: "/wd/hub",
      port: 4723,
      logLevel: "warn",
      capabilities,
      /**
       * @param hostName requires to be 0.0.0.0 in Mac.
       * Default is localhost
       */
      hostname: hostName,
    });

    Logger.info(`Appium capabilities: ${JSON.stringify(capabilities)}`);

    return new AppiumDriver({ client, bundleId: appPackage, appActivity });
  }

  startApp() {
    executeCommand(`adb shell am start ${this.bundleId}/${this.appActivity}`);
  }

  restartApp() {
    this.stopApp();
    this.startApp();
  }

  stopApp() {
    executeCommand(`adb shell am force-stop ${this.bundleId}`);
  }

  async wait(delay: number) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  async takeScreenShot(screenName: string) {
    // Make sure screen is fully render by waiting an arbitrary amount of time
    const TEN_SECONDS = 10000;
    await this.wait(TEN_SECONDS);

    const screen = await this.client.$(
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout"
    );
    const id = screen.elementId;
    const base64Image = await this.client.takeElementScreenshot(id);
    // expect(base64Image).toMatchImageSnapshot({
    //   customSnapshotIdentifier: screenName,
    // });
  }

  async byText(text: string) {
    return this.client.$(`//*[contains(@text,'${text}')]`);
  }

  async waitForElement(element: webdriver.Element) {
    await element.waitForExist({ timeout: this.timeout, interval: 100 });
  }

  async takeScreenshotOnFailure(
    command: () => Promise<void>,
    errorScreenshotName: string
  ) {
    // eslint-disable-next-line no-useless-catch
    try {
      await command();
    } catch (error) {
      // await this.takeScreenShot(`ERROR_${errorScreenshotName}`);
      throw error;
    }
  }

  xpathByResourceId(id: string) {
    return `//*[contains(@resource-id, "${id}")]`;
  }

  async findElementsById(testID: string) {
    return await this.client.$$(this.xpathByResourceId(testID));
  }

  async findElementById(testID: string) {
    const element = await this.client.$(this.xpathByResourceId(testID));
    await this.waitForElement(element);

    return element;
  }

  async checkIfDisplayedWithScrollDown(
    elementText: string,
    maxScrolls = 10,
    amount = 0
  ) {
    const element = await this.byText(elementText);
    await this.takeScreenshotOnFailure(
      () =>
        this.gestures.checkIfDisplayedWithScrollDown(
          element,
          maxScrolls,
          amount
        ),
      `checkIfDisplayedWithScrollDown_${elementText}`
    );
  }

  async findElementByText(text: string) {
    const element = await this.byText(text);
    await this.takeScreenshotOnFailure(
      () => this.waitForElement(element),
      `${text}_NOT_FOUND`
    );

    return element;
  }

  async clickElementById(id: string) {
    const element = await this.findElementById(id);
    return await element.click();
  }

  async clickElementByText(text: string) {
    const element = await this.findElementByText(text);
    return await element.click();
  }

  async switchToNativeAppContext() {
    return await this.client.switchContext("NATIVE_APP");
  }

  async runUIAutomatorCommand(selector: string) {
    return this.client.$(`android=${selector}`);
  }

  /**
   *
   * @param steps: number of steps. Use this to control the speed of the scroll action.
   * UIAutomator default is 55 (and is quite slow), a lower number will increase speed
   *
   * See https://developer.android.com/reference/androidx/test/uiautomator/UiScrollable#scrollforward
   */
  async scrollDown(steps = 5) {
    // See https://stackoverflow.com/questions/63238189/appium-how-to-scroll-down-using-uiautomator2-and-webdriverio-with-react-native
    const selector = `new UiScrollable(new UiSelector().scrollable(true)).scrollForward(${steps})`;
    return this.runUIAutomatorCommand(selector);
  }

  /**
   *
   * @param maxSwipes: max amount of swipe gestures to perform
   * @param steps: number of steps. Use this to control the speed of the scroll action.
   * UIAutomator default is 55 (and is quite slow), a lower number will increase speed
   *
   * See https://developer.android.com/reference/androidx/test/uiautomator/UiScrollable#scrolltoend_1
   */
  async scrollToEnd(maxSwipes = 100, steps = 5) {
    const selector = `new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(${maxSwipes}, ${steps})`;
    return this.runUIAutomatorCommand(selector);
  }

  async switchToWebviewContext() {
    return await this.client.switchContext(`WEBVIEW_${this.bundleId}`);
  }
}
