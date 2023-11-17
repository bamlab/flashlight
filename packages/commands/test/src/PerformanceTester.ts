import { Logger } from "@perf-profiler/logger";
import { TestCaseIterationResult } from "@perf-profiler/types";
import { profiler } from "@perf-profiler/profiler";
import * as p from "path";
import { Options, SingleIterationTester, TestCase } from "./SingleIterationTester";
import { writeReport } from "./writeReport";

export type PerformanceTesterOptions = Omit<
  Options,
  "resultsFileOptions" | "iterationCount" | "recordOptions" | "maxRetries"
> & {
  recordOptions?: Options["recordOptions"];
  maxRetries?: Options["maxRetries"];
  iterationCount?: Options["iterationCount"];
  resultsFileOptions?: {
    path?: string;
    title?: string;
  };
};

export class PerformanceTester {
  public measures: TestCaseIterationResult[] = [];
  private retryCount = 0;
  options: Options;

  constructor(
    private bundleId: string,
    private testCase: TestCase,
    options: PerformanceTesterOptions = {}
  ) {
    // Important to ensure that the CPP profiler is initialized before we run the test!
    profiler.installProfilerOnDevice();

    const title = options.resultsFileOptions?.title || "Results";

    const path = options.resultsFileOptions?.path;
    const filePath = path ? p.join(process.cwd(), p.dirname(path)) : `${process.cwd()}`;
    const fileName = path
      ? p.basename(path)
      : `${title.toLocaleLowerCase().replace(/ /g, "_")}_${new Date().getTime()}`;

    this.options = {
      ...options,
      iterationCount: options.iterationCount ?? 10,
      maxRetries: options.maxRetries || 0,
      recordOptions: options.recordOptions || {
        record: false,
      },
      resultsFileOptions: {
        path: path || `${filePath}/${fileName}.json`,
        title,
      },
    };
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
        this.checkRetryIsPossible(singleIterationTester);
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

  writeResults() {
    const { path, title } = this.options.resultsFileOptions;
    writeReport(this.measures, {
      filePath: path,
      title,
      overrideScore: this.testCase.getScore,
    });
  }

  private checkRetryIsPossible(singleIterationTester: SingleIterationTester) {
    this.retryCount++;
    if (this.retryCount > this.options.maxRetries) {
      throw new Error("Max number of retries reached.");
    }
    singleIterationTester.setIsRetry(true);
    Logger.error(
      `Ignoring measure and retrying... (retry ${this.retryCount}/${this.options.maxRetries})`
    );
  }

  private logIterationStart(currentIterationIndex: number) {
    Logger.info(`Running iteration ${currentIterationIndex + 1}/${this.options.iterationCount}`);
  }

  private logFailedIteration(currentIterationIndex: number, error: unknown) {
    Logger.error(
      `Iteration ${currentIterationIndex + 1}/${this.options.iterationCount} failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }

  private logSuccessfulIteration(currentIterationIndex: number, time: number | undefined) {
    Logger.success(
      `Finished iteration ${currentIterationIndex + 1}/${this.options.iterationCount} in ${
        time ?? "unknown"
      }ms (${this.retryCount} ${this.retryCount > 1 ? "retries" : "retry"} so far)`
    );
  }
}
