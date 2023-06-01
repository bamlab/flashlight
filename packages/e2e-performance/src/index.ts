import { writeReport } from "./writeReport";
import * as p from "path";
import {
  PerformanceTester,
  TestCase,
  RecordOptions,
} from "./PerformanceTester";

export { TestCase, RecordOptions };

export const measurePerformance = async (
  bundleId: string,
  testCase: TestCase,
  iterationCount = 10,
  maxRetries = 3,
  recordOptions: {
    record: boolean;
    size?: string;
    bitRate?: number;
  } = {
    record: false,
  },
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
    ...recordOptions,
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
