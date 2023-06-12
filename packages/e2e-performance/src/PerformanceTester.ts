import { Logger } from "@perf-profiler/logger";
import { TestCaseIterationResult } from "@perf-profiler/types";
import { ensureCppProfilerIsInstalled } from "@perf-profiler/profiler";
import {
  Options,
  SingleIterationTester,
  TestCase,
} from "./SingleIterationTester";

export class PerformanceTester {
  public measures: TestCaseIterationResult[] = [];
  private retryCount = 0;

  constructor(
    private bundleId: string,
    private testCase: TestCase,
    private options: Options
  ) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    ensureCppProfilerIsInstalled();
  }

  async iterate(): Promise<void> {
    let currentIterationIndex = 0;
    this.measures = [];

    while (currentIterationIndex < this.options.iterationCount) {
      const singleIterationTester = new SingleIterationTester(
        this.bundleId,
        this.testCase,
        this.options,
        currentIterationIndex
      );

      this.logIterationStart(currentIterationIndex);
      try {
        await singleIterationTester.executeTestCase();
        this.logSuccessfulIteration(
          currentIterationIndex,
          singleIterationTester.getCurrentTestCaseIterationResult()?.time
        );
        currentIterationIndex++;
      } catch (error) {
        this.logFailedIteration(currentIterationIndex, error);
        this.retryCount++;
        if (this.retryCount > this.options.maxRetries) {
          throw new Error("Max number of retries reached.");
        }
        Logger.error(
          `Ignoring measure and retrying... (retry ${this.retryCount}/${this.options.maxRetries})`
        );
      } finally {
        const currentTestCaseIterationResult =
          singleIterationTester.getCurrentTestCaseIterationResult();
        if (currentTestCaseIterationResult) {
          this.measures.push(currentTestCaseIterationResult);
        }
      }
    }

    if (this.measures.length === 0) {
      throw new Error("No measure returned");
    }
  }

  private logIterationStart(currentIterationIndex: number) {
    Logger.info(
      `Running iteration ${currentIterationIndex + 1}/${
        this.options.iterationCount
      }`
    );
  }

  private logFailedIteration(currentIterationIndex: number, error: unknown) {
    Logger.error(
      `Iteration ${
        currentIterationIndex + 1
      }/${currentIterationIndex} failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }

  private logSuccessfulIteration(
    currentIterationIndex: number,
    time: number | undefined
  ) {
    Logger.success(
      `Finished iteration ${currentIterationIndex + 1}/${
        this.options.iterationCount
      } in ${time ?? "unknown"}ms (${this.retryCount} ${
        this.retryCount > 1 ? "retries" : "retry"
      } so far)`
    );
  }
}
