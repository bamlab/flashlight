import { Logger } from "@perf-profiler/logger";
import {
  AveragedTestCaseResult,
  TestCaseIterationResult,
} from "@perf-profiler/types";
import { PerformanceMeasurer } from "./PerformanceMeasurer";
import {
  ensureCppProfilerIsInstalled,
  ScreenRecorder,
} from "@perf-profiler/profiler";
import { writeReport } from "./writeReport";
import * as p from "path";

export interface TestCase {
  beforeTest?: () => Promise<void> | void;
  run: () => Promise<void> | void;
  afterTest?: () => Promise<void> | void;
  duration?: number;
  getScore?: (result: AveragedTestCaseResult) => number;
}
class PerformanceTester {
  constructor(private bundleId: string, private testCase: TestCase) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  private async executeTestCase(
    iterationCount: number,
    recordOptions: {
      record: boolean;
      path: string;
      title: string;
    }
  ): Promise<TestCaseIterationResult> {
    try {
      const { beforeTest, run, afterTest, duration } = this.testCase;

      if (beforeTest) await beforeTest();

      const recorder = new ScreenRecorder(
        `${recordOptions.title}_iter${iterationCount}.mp4`
      );
      if (recordOptions.record) {
        await recorder.startRecording();
      }

      const performanceMeasurer = new PerformanceMeasurer(this.bundleId);
      performanceMeasurer.start();

      await run();
      const measures = await performanceMeasurer.stop(duration);
      if (recordOptions.record) {
        await recorder.stopRecording();
        await recorder.pullRecording(recordOptions.path);
      }

      if (afterTest) await afterTest();

      if (recordOptions.record) {
        return {
          ...measures,
          videoInfos: {
            path: `${recordOptions.path}/${recordOptions.title}_iter${iterationCount}.mp4`,
            startOffset: Math.floor(
              measures.startTime - recorder.getRecordingStartTime()
            ),
          },
        };
      }

      return measures;
    } catch (error) {
      throw new Error("Error while running test");
    }
  }

  async iterate(
    iterationCount: number,
    maxRetries: number,
    recordOptions: {
      record: boolean;
      path: string;
      title: string;
    }
  ): Promise<TestCaseIterationResult[]> {
    let retriesCount = 0;
    let currentIterationIndex = 0;
    const measures: TestCaseIterationResult[] = [];

    while (currentIterationIndex < iterationCount) {
      Logger.info(
        `Running iteration ${currentIterationIndex + 1}/${iterationCount}`
      );
      try {
        const measure = await this.executeTestCase(
          currentIterationIndex,
          recordOptions
        );
        Logger.success(
          `Finished iteration ${
            currentIterationIndex + 1
          }/${iterationCount} in ${measure.time}ms (${retriesCount} ${
            retriesCount > 1 ? "retries" : "retry"
          } so far)`
        );
        measures.push(measure);
        currentIterationIndex++;
      } catch (error) {
        Logger.error(
          `Iteration ${
            currentIterationIndex + 1
          }/${iterationCount} failed (ignoring measure): ${
            error instanceof Error ? error.message : "unknown error"
          }`
        );

        retriesCount++;
        if (retriesCount > maxRetries) {
          throw new Error("Max number of retries reached.");
        }
      }
    }

    if (measures.length === 0) {
      throw new Error("No measure returned");
    }

    return measures;
  }
}

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  iterationCount = 10,
  maxRetries = 3,
  record = false,
  {
    path,
    title: givenTitle,
  }: {
    path?: string;
    title?: string;
  } = {}
) => {
  const title = givenTitle || "Results";

  const filePath = path
    ? p.join(process.cwd(), p.dirname(path))
    : `${process.cwd()}`;
  const fileName = path
    ? p.basename(path)
    : `${title.toLocaleLowerCase().replace(/ /g, "_")}_${new Date().getTime()}`;

  const tester = new PerformanceTester(bundleId, testCase);
  const measures = await tester.iterate(iterationCount, maxRetries, {
    record,
    path: filePath,
    title: fileName.replace(".json", ""),
  });

  return {
    measures,
    writeResults: () =>
      writeReport(measures, {
        filePath: path || `${filePath}/${fileName}.json`,
        title,
        overrideScore: testCase.getScore,
      }),
  };
};
