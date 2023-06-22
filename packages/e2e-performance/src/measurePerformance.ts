import { PerformanceTester, PerformanceTesterOptions } from "./PerformanceTester";
import { TestCase } from "./SingleIterationTester";

export { TestCase };

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  options?: PerformanceTesterOptions
) => {
  const tester = new PerformanceTester(bundleId, testCase, options);

  await tester.iterate();

  return {
    measures: tester.measures,
    writeResults: () => tester.writeResults(),
  };
};
