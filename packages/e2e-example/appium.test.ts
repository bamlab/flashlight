// @flow

import { AppiumDriver } from "@bam.tech/appium-helper";
import { TestCase, PerformanceTester } from "@perf-profiler/e2e";

const BundleId = {
  FLUTTER: "com.example.clash_of_techs_twitter_feed",
  RN: "com.reactnativefeed",
  NATIVE: "tech.bam.twitbench",
};

const bundleId = BundleId.NATIVE;

const getTestCases = async () => {
  const driver = await AppiumDriver.create({
    appPackage: bundleId,
    appActivity: `${bundleId}.MainActivity`,
  });

  const startAppTestCase: TestCase = {
    beforeTest: async () => {
      driver.stopApp();
      await driver.wait(3000);
    },
    run: async () => {
      driver.startApp();

      if (bundleId === BundleId.FLUTTER) {
        // await driver.client.$(`//android.widget.ImageView[@content-desc=""]`);
      } else {
        await driver.findElementByText("Notre CEO");
      }
    },
  };

  const scrollTestCase: TestCase = {
    beforeTest: async () => {
      // Restart app
      await startAppTestCase.beforeTest?.();
      await startAppTestCase.run();
    },
    run: async () => {
      for (let index = 0; index < 10; index++) {
        await driver.gestures.swipeUp();
        await driver.wait(1000);
      }
    },
  };

  return {
    START: startAppTestCase,
    SCROLL: scrollTestCase,
  };
};

test.skip("e2e", async () => {
  const testCases = await getTestCases();

  const measures = await new PerformanceTester(bundleId).iterate(
    testCases.SCROLL,
    10
  );

  require("fs").writeFileSync(
    `./results_${new Date().getTime()}.json`,
    JSON.stringify(measures)
  );
});
