/**
 * Taken from https://github.com/webdriverio/appium-boilerplate/blob/master/tests/helpers/Gestures.js
 */

import * as webdriver from "webdriverio";

/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
  down: {
    start: { x: 50, y: 15 },
    end: { x: 50, y: 85 },
  },
  left: {
    start: { x: 95, y: 50 },
    end: { x: 5, y: 50 },
  },
  right: {
    start: { x: 5, y: 50 },
    end: { x: 95, y: 50 },
  },
  up: {
    start: { x: 50, y: 85 },
    end: { x: 50, y: 15 },
  },
};

export class GestureHandler {
  SCREEN_SIZE: WebDriver.RectReturn | null;
  client: webdriver.BrowserObject;

  constructor(client: webdriver.BrowserObject) {
    this.client = client;
    this.SCREEN_SIZE = null;
  }

  /**
   * Check if an element is visible and if not scroll down a portion of the screen to
   * check if it visible after a x amount of scrolls
   *
   * @param {element} element
   * @param {number} maxScrolls
   * @param {number} amount
   */
  async checkIfDisplayedWithScrollDown(
    element: webdriver.Element,
    maxScrolls: number = 5,
    amount: number = 0
  ) {
    const isExisting = await element.isExisting();
    const isDisplayed = await element.isDisplayed();
    if ((!isExisting || !isDisplayed) && amount <= maxScrolls) {
      await this.swipeUp(0.85);
      await this.checkIfDisplayedWithScrollDown(
        element,
        maxScrolls,
        amount + 1
      );
    } else if (amount > maxScrolls) {
      throw new Error(
        `The element '${element}' could not be found or is not visible.`
      );
    }
  }

  /**
   * Swipe down based on a percentage
   *
   * @param {number} percentage from 0 - 1
   */
  async swipeDown(percentage: number = 1) {
    await this.swipeOnPercentage(
      this._calculateXY(SWIPE_DIRECTION.down.start, percentage),
      this._calculateXY(SWIPE_DIRECTION.down.end, percentage)
    );
  }

  /**
   * Swipe Up based on a percentage
   *
   * @param {number} percentage from 0 - 1
   */
  async swipeUp(percentage: number = 1) {
    await this.swipeOnPercentage(
      this._calculateXY(SWIPE_DIRECTION.up.start, percentage),
      this._calculateXY(SWIPE_DIRECTION.up.end, percentage)
    );
  }

  /**
   * Swipe left based on a percentage
   *
   * @param {number} percentage from 0 - 1
   */
  async swipeLeft(percentage: number = 1) {
    await this.swipeOnPercentage(
      this._calculateXY(SWIPE_DIRECTION.left.start, percentage),
      this._calculateXY(SWIPE_DIRECTION.left.end, percentage)
    );
  }

  /**
   * Swipe right based on a percentage
   *
   * @param {number} percentage from 0 - 1
   */
  async swipeRight(percentage: number = 1) {
    await this.swipeOnPercentage(
      this._calculateXY(SWIPE_DIRECTION.right.start, percentage),
      this._calculateXY(SWIPE_DIRECTION.right.end, percentage)
    );
  }

  /**
   * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
   * percentages of the screen.
   *
   * @param {object} from { x: 50, y: 50 }
   * @param {object} to { x: 25, y: 25 }
   *
   * @example
   * <pre>
   *   // This is a swipe to the left
   *   const from = { x: 50, y:50 }
   *   const to = { x: 25, y:50 }
   * </pre>
   */
  async swipeOnPercentage(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    this.SCREEN_SIZE = await this.client.getWindowRect();
    const pressOptions = this._getDeviceScreenCoordinates(
      this.SCREEN_SIZE,
      from
    );
    const moveToScreenCoordinates = this._getDeviceScreenCoordinates(
      this.SCREEN_SIZE,
      to
    );
    await this.swipe(pressOptions, moveToScreenCoordinates);
  }

  /**
   * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
   *
   * @param {object} from { x: 50, y: 50 }
   * @param {object} to { x: 25, y: 25 }
   *
   * @example
   * <pre>
   *   // This is a swipe to the left
   *   const from = { x: 50, y:50 }
   *   const to = { x: 25, y:50 }
   * </pre>
   */
  async swipe(from: object, to: object) {
    await this.client.touchPerform([
      {
        action: "press",
        options: from,
      },
      {
        action: "wait",
        options: { ms: 100 },
      },
      {
        action: "moveTo",
        options: to,
      },
      {
        action: "release",
      },
    ]);
    await this.client.pause(1000);
  }

  /**
   * Get the screen coordinates based on a device his screensize
   *
   * @param {object} screenSize the size of the screen
   * @param {object} coordinates like { x: 50, y: 50 }
   *
   * @return {{x: number, y: number}}
   *
   * @private
   */
  _getDeviceScreenCoordinates(
    screenSize: { width: number; height: number },
    coordinates: { x: number; y: number }
  ): { x: number; y: number } {
    return {
      x: Math.round(screenSize.width * (coordinates.x / 100)),
      y: Math.round(screenSize.height * (coordinates.y / 100)),
    };
  }

  /**
   * Calculate the x y coordinates based on a percentage
   *
   * @param {object} coordinates
   * @param {number} percentage
   *
   * @return {{x: number, y: number}}
   *
   * @private
   */
  _calculateXY(
    { x, y }: { x: number; y: number },
    percentage: number
  ): { x: number; y: number } {
    return {
      x: x * percentage,
      y: y * percentage,
    };
  }
}
