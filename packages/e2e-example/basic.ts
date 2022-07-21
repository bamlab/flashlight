// @flow

import { execSync } from "child_process";
import { TestCase, PerformanceTester } from "@perf-profiler/e2e";

const bundleId = "com.reactnativefeed";
const appActivity = `${bundleId}.MainActivity`;

const stopApp = () => execSync(`adb shell am force-stop ${bundleId}`);
const startApp = () =>
  execSync(`adb shell am start ${bundleId}/${appActivity}`);

const startTestCase: TestCase = {
  duration: 15000,
  beforeTest: () => {
    stopApp();
  },
  run: () => {
    startApp();
  },
};

const test = async () => {
  const performanceTester = new PerformanceTester(bundleId);
  await performanceTester.iterate(startTestCase, 10);
  performanceTester.writeResults();
};

test();
