import fs from "fs";
import { ArtifactType } from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { testRepository } from "../repositories";
import { TMP_FOLDER } from "../TMP_FOLDER";
import { downloadFile } from "../utils/downloadFile";
import { unzip } from "../utils/unzip";

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

  unzip(LOGS_FILE_TMP_PATH, tmpFolder);

  fs.rmSync(LOGS_FILE_TMP_PATH);
  fs.readdirSync(tmpFolder).forEach((file) => {
    if (file.endsWith(".json")) {
      fs.renameSync(`${tmpFolder}/${file}`, `${reportDestinationPath}/${file}`);
    }
  });
  fs.rmSync(tmpFolder, { recursive: true, force: true });

  Logger.success(
    `Results available, run "npx @perf-profiler/web-reporter ${reportDestinationPath}" to see them`
  );
};
