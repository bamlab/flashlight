import fs from "fs";
import { TestCaseResult } from "@perf-profiler/types";

// We should have better management of the time interval over the repo
const MEASURE_INTERVAL = 500;

const assertTimeIntervalMultiple = (n: number) => {
  if (n % MEASURE_INTERVAL !== 0) {
    throw new Error(
      `Only multiples of the measure interval (${MEASURE_INTERVAL}ms) are supported`
    );
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

  const firstMeasureIndex = skip / MEASURE_INTERVAL;

  return results.map((result) => ({
    ...result,
    iterations: result.iterations.map((iteration) => ({
      ...iteration,
      measures: iteration.measures.slice(
        firstMeasureIndex,
        duration
          ? firstMeasureIndex + duration / MEASURE_INTERVAL + 1
          : iteration.measures.length
      ),
    })),
  }));
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

  const report = JSON.stringify(
    getMeasuresForTimeInterval({ results, skip, duration })
  );

  const jsFileContent = fs
    .readFileSync(`${__dirname}/${scriptName}`, "utf8")
    .replace('"INSERT_HERE"', report);

  fs.writeFileSync(`${outputDir}/report.js`, jsFileContent);

  const htmlFilePath = `${outputDir}/report.html`;
  fs.writeFileSync(htmlFilePath, newHtmlContent);

  return htmlFilePath;
};
