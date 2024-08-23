import { TestCase } from "@perf-profiler/e2e";
import { AppiumDriver } from "@bam.tech/appium-helper";
import { getScore } from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";

export const createStartAppTestCase = ({
  driver,
  waitForAppStart,
}: {
  driver: AppiumDriver;
  waitForAppStart: () => Promise<unknown>;
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
  getScore: (result: AveragedTestCaseResult, refreshRate: number) => {
    /**
     * Startup time factor
     *
     * Cold start should be <= 5s
     */
    const factor = (x: number) => (1 - (Math.atan((x - 1) / 5) / Math.PI) * 2) * 1.5;
    return getScore(result, refreshRate) * factor(result.average.time / 1000);
  },
});
