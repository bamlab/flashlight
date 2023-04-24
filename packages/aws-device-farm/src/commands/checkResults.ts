import fs from "fs";
import path from "path";
import { ArtifactType } from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { TestCaseResult } from "@perf-profiler/types";
import { testRepository } from "../repositories";
import { TMP_FOLDER } from "../TMP_FOLDER";
import { downloadFile } from "../utils/downloadFile";
import { unzip } from "../utils/unzip";
import { execSync } from "child_process";

const changeVideoPathsOnResult = (
  report: TestCaseResult,
  reportDestinationPath: string
): TestCaseResult => ({
  ...report,
  iterations: report.iterations.map((iteration) => ({
    ...iteration,
    videoInfos: iteration.videoInfos
      ? {
          ...iteration.videoInfos,
          path: `${reportDestinationPath}/${path.basename(
            iteration.videoInfos.path
          )}`,
        }
      : undefined,
  })),
});

export const checkResults = async ({
  testRunArn,
  reportDestinationPath,
}: {
  testRunArn: string;
  reportDestinationPath: string;
}) => {
  await testRepository.waitForCompletion({ arn: testRunArn });
  const url = await testRepository.getArtifactUrl({
    arn: testRunArn,
    type: ArtifactType.CUSTOMER_ARTIFACT,
  });
  const tmpFolder = `${TMP_FOLDER}/${new Date().getTime()}`;
  fs.mkdirSync(tmpFolder);

  const LOGS_FILE_TMP_PATH = `${tmpFolder}/logs.zip`;
  await downloadFile(url, LOGS_FILE_TMP_PATH);

  if (!fs.existsSync(reportDestinationPath)) {
    fs.mkdirSync(reportDestinationPath);
  }

  unzip(LOGS_FILE_TMP_PATH, tmpFolder);

  fs.rmSync(LOGS_FILE_TMP_PATH);
  fs.readdirSync(tmpFolder).forEach((file) => {
    if (file.endsWith(".json")) {
      const report: TestCaseResult = JSON.parse(
        fs.readFileSync(`${tmpFolder}/${file}`).toString()
      );
      fs.writeFileSync(
        `${reportDestinationPath}/${file}`,
        JSON.stringify(changeVideoPathsOnResult(report, reportDestinationPath))
      );
    }

    if (file.endsWith(".mp4")) {
      // When coming from AWS Device Farm, it seems the video is not encoded properly
      Logger.info(`Fixing video metadata on ${file}...`);
      // VSync 0 is important since we have variable frame rate from adb shell screenrecord
      execSync(
        `ffmpeg -vsync 0 -i ${tmpFolder}/${file} -c:v libx264 -crf 23 -c:a aac -b:a 128k ${reportDestinationPath}/${file} -loglevel error`
      );
    }
  });

  fs.rmSync(tmpFolder, { recursive: true, force: true });

  Logger.success(
    `Results available, run "npx @perf-profiler/web-reporter ${reportDestinationPath}" to see them`
  );
};
