import fs from "fs";
import path from "path";
import { ArtifactType } from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { TestCaseResult } from "@perf-profiler/types";
import { testRepository } from "../repositories";
import { TMP_FOLDER } from "../TMP_FOLDER";
import { downloadFile } from "../utils/downloadFile";
import { unzip } from "../utils/unzip";
import { spawn } from "child_process";

const execAsync = (command: string) =>
  new Promise<void>((resolve, reject) => {
    const parts = command.split(" ");
    const proc = spawn(parts[0], parts.slice(1));

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command ${command} failed with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on("error", reject);
  });

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
  Logger.info("Downloading artifacts...");
  await downloadFile(url, LOGS_FILE_TMP_PATH);

  if (!fs.existsSync(reportDestinationPath)) {
    fs.mkdirSync(reportDestinationPath);
  }

  unzip(LOGS_FILE_TMP_PATH, tmpFolder);
  fs.rmSync(LOGS_FILE_TMP_PATH);

  const processReportFile = (fileName: string) => {
    const report: TestCaseResult = JSON.parse(
      fs.readFileSync(`${tmpFolder}/${fileName}`).toString()
    );
    fs.writeFileSync(
      `${reportDestinationPath}/${fileName}`,
      JSON.stringify(changeVideoPathsOnResult(report, reportDestinationPath))
    );
  };

  const processVideoFile = async (fileName: string) => {
    // When coming from AWS Device Farm, it seems the video is not encoded properly
    Logger.info(`Fixing video metadata on ${fileName}...`);
    // VSync 0 is important since we have variable frame rate from adb shell screenrecord
    await execAsync(
      `ffmpeg -y -vsync 0 -i ${tmpFolder}/${fileName} -c:v libx264 -crf 23 -c:a aac -b:a 128k ${reportDestinationPath}/${fileName} -loglevel error`
    );
    Logger.info(`Video ${fileName} processed ✅`);
  };

  await Promise.all(
    fs.readdirSync(tmpFolder).map((file) => {
      if (file.endsWith(".json")) {
        return processReportFile(file);
      }

      if (file.endsWith(".mp4")) {
        return processVideoFile(file);
      }

      return Promise.resolve();
    })
  );

  fs.rmSync(tmpFolder, { recursive: true, force: true });

  Logger.success(
    `Results available, run "npx @perf-profiler/web-reporter ${reportDestinationPath}" to see them`
  );
};
