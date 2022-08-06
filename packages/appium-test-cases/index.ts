import { TestCase } from "@perf-profiler/e2e";
import { AppiumDriver } from "@bam.tech/appium-helper";

export const createStartAppTestCase = ({
  driver,
  waitForAppStart,
}: {
  driver: AppiumDriver;
  waitForAppStart: () => Promise<void>;
}): TestCase => ({
  duration: 10000,
  beforeTest: async () => {
    driver.stopApp();
    // Awaiting an arbitrary amount of time just to be sure app is completely off
    await driver.wait(3000);
  },
  run: async () => {
    driver.startApp();
    await waitForAppStart();
  },
});
