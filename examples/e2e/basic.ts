import { execSync } from "child_process";
import { TestCase, measurePerformance } from "@perf-profiler/e2e";

const bundleId = "com.reactnativefeed";

const stopApp = () => execSync(`adb shell am force-stop ${bundleId}`);
const startApp = () =>
  execSync(
    `adb shell monkey -p ${bundleId} -c android.intent.category.LAUNCHER 1`
  );

const startTestCase: TestCase = {
  duration: 10000,
  beforeTest: () => {
    stopApp();
  },
  run: () => {
    startApp();
  },
};

const test = async () => {
  const { writeResults } = await measurePerformance(
    bundleId,
    startTestCase,
    10
  );
  writeResults();
};

test();
