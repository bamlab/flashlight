import fs from "fs";
import { POLLING_INTERVAL, TestCaseResult } from "@perf-profiler/types";
import path from "path";

const assertTimeIntervalMultiple = (n: number) => {
  if (n % POLLING_INTERVAL !== 0) {
    throw new Error(`Only multiples of the measure interval (${POLLING_INTERVAL}ms) are supported`);
  }
};

export const getMeasuresForTimeInterval = ({
  duration,
  skip,
  results,
}: {
  duration: number | null;
  skip: number;
  results: TestCaseResult[];
}): TestCaseResult[] => {
  assertTimeIntervalMultiple(skip);
  if (duration !== null) assertTimeIntervalMultiple(duration);

  const firstMeasureIndex = skip / POLLING_INTERVAL;

  return results.map((result) => ({
    ...result,
    iterations: result.iterations.map((iteration) => ({
      ...iteration,
      measures: iteration.measures.slice(
        firstMeasureIndex,
        duration ? firstMeasureIndex + duration / POLLING_INTERVAL + 1 : iteration.measures.length
      ),
    })),
  }));
};

const copyVideoFiles = (results: TestCaseResult[], outputDir: string) => {
  results.forEach((result) => {
    result.iterations.forEach((iteration) => {
      const videoPath = iteration.videoInfos?.path;
      if (videoPath && fs.existsSync(videoPath)) {
        const videoName = path.basename(videoPath);
        const destinationPath = path.join(outputDir, videoName);
        fs.copyFileSync(videoPath, destinationPath);
      }
    });
  });
};

export const writeReport = ({
  jsonPaths,
  outputDir,
  duration,
  skip = 0,
}: {
  jsonPaths: string[];
  outputDir: string;
  duration: number | null;
  skip: number;
}) => {
  const newJsFile = "report.js";

  const oldHtmlContent = fs.readFileSync(`${__dirname}/index.html`, "utf8");
  const scriptName = oldHtmlContent.match(/src="(.*?)"/)?.[1];

  const newHtmlContent = fs
    .readFileSync(`${__dirname}/index.html`, "utf8")
    .replace(`src="${scriptName}"`, `src="${newJsFile}"`)
    .replace('type="module"', "");

  const getJsonPaths = () => {
    return jsonPaths
      .map((path) => {
        const isDirectory = fs.lstatSync(path).isDirectory();

        if (isDirectory) {
          return fs
            .readdirSync(path)
            .filter((file) => file.endsWith(".json"))
            .map((file) => `${path}/${file}`);
        } else {
          return path;
        }
      })
      .flat();
  };

  const results: TestCaseResult[] = getJsonPaths().map((path) =>
    JSON.parse(fs.readFileSync(path, "utf8"))
  );

  const isIOSTestCaseResult = results.every((result) => result.type === "IOS_EXPERIMENTAL");

  const report = JSON.stringify(getMeasuresForTimeInterval({ results, skip, duration }));

  const jsFileContent = fs.readFileSync(`${__dirname}/${scriptName}`, "utf8").replace(
    // See App.tsx for the reason why we do this
    '"THIS_IS_A_VERY_LONG_STRING_THAT_IS_UNLIKELY_TO_BE_FOUND_IN_A_TEST_CASE_RESULT"',
    report
  );

  fs.writeFileSync(`${outputDir}/report.js`, jsFileContent);

  const htmlFilePath = `${outputDir}/report.html`;
  if (!isIOSTestCaseResult) copyVideoFiles(results, outputDir);
  fs.writeFileSync(htmlFilePath, newHtmlContent);
  return htmlFilePath;
};
