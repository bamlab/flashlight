// @flow

import { AppiumDriver } from "@bam.tech/appium-helper";
import { TestCase, PerformanceTester } from "@bam.tech/e2e-performance";
import {
  getAverageCpuUsage,
  getHighCpuUsageStats,
} from "android-performance-profiler";

test("e2e", async () => {
  const bundleId = "com.example";
  const driver = await AppiumDriver.create({
    appPackage: bundleId,
    appActivity: `${bundleId}.MainActivity`,
  });

  const startAppTestCase: TestCase = {
    beforeTest: () => driver.stopApp(),
    run: async () => {
      driver.startApp();
      await driver.findElementByText("My Text");
    },
  };

  const measures = await new PerformanceTester(bundleId).iterate(
    startAppTestCase
  );

  for (const measure of measures) {
    const message = `=====MEASURE====
    ${measure.coldStartTime}ms
    ${JSON.stringify(getHighCpuUsageStats(measure.cpuMeasures), null, 2)}
    ${
      getAverageCpuUsage(measure.cpuMeasures) * measure.cpuMeasures.length * 0.5
    }
    `;
    console.log(message);
  }
});
