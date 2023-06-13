import * as p from "path";
import { PerformanceTester } from "./PerformanceTester";
import { TestCase } from "./SingleIterationTester";

export { TestCase };

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  options: {
    iterationCount?: number;
    maxRetries?: number;
    recordOptions?: {
      record: boolean;
      size?: string;
      bitRate?: number;
    };
    resultsFileOptions?: {
      path?: string;
      title?: string;
    };
  } = {}
) => {
  const tester = new PerformanceTester(bundleId, testCase, {
    iterationCount: options.iterationCount ?? 10,
    maxRetries: options.maxRetries || 0,
    recordOptions: options.recordOptions || {
      record: false,
    },
    resultsFileOptions: options.resultsFileOptions,
  });

  await tester.iterate();

  return {
    measures: tester.measures,
    writeResults: () => tester.writeResults(),
  };
};
