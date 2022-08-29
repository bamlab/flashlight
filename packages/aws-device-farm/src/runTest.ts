import {
  ArtifactType,
  DeviceFarmClient,
  UploadType,
} from "@aws-sdk/client-device-farm";
import fs from "fs";
import { Logger } from "@perf-profiler/logger";
import { execSync } from "child_process";
import { createTestSpecFile } from "./createTestSpecFile";
import { downloadFile } from "./downloadFile";
import { DevicePoolRepository } from "./repositories/devicePool";
import { ProjectRepository } from "./repositories/project";
import { TestRepository } from "./repositories/test";
import { UploadRepository } from "./repositories/upload";
import { zipTestFolder } from "./zipTestFolder";

const DEFAULT_REGION = "us-west-2";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "Please provide AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables"
  );
}

const client = new DeviceFarmClient({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: DEFAULT_REGION,
});

const projectRepository = new ProjectRepository(client);
const devicePoolRepository = new DevicePoolRepository(client);
const uploadRepository = new UploadRepository(client);
const testRepository = new TestRepository(client);

export const runTest = async ({
  projectName,
  apkPath,
  testSpecsPath,
  testFolder,
  testName,
  testCommand,
  deviceName,
}: {
  projectName: string;
  apkPath: string;
  testSpecsPath: string;
  testFolder: string;
  testName: string;
  testCommand: string;
  deviceName: string;
}): Promise<string> => {
  const projectArn = await projectRepository.getOrCreate({ name: projectName });
  const devicePoolArn = await devicePoolRepository.getOrCreate({
    projectArn,
    deviceName,
  });

  const testFolderZipPath = zipTestFolder(testFolder);

  const apkUploadArn = await uploadRepository.upload({
    projectArn,
    filePath: apkPath,
    type: UploadType.ANDROID_APP,
  });

  const newTestSpecPath = createTestSpecFile({
    testSpecsPath,
    testCommand,
  });
  const testSpecArn = await uploadRepository.upload({
    projectArn,
    filePath: newTestSpecPath,
    type: UploadType.APPIUM_NODE_TEST_SPEC,
  });
  fs.rmSync(newTestSpecPath);
  const testPackageArn = await uploadRepository.upload({
    projectArn,
    filePath: testFolderZipPath,
    type: UploadType.APPIUM_NODE_TEST_PACKAGE,
  });

  Logger.info("Starting test run...");
  const testRunArn = await testRepository.scheduleRun({
    projectArn,
    apkUploadArn,
    devicePoolArn,
    testName,
    testPackageArn,
    testSpecArn,
  });

  return testRunArn;
};

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
  const LOGS_FILE_TMP_PATH = "logs.zip";
  downloadFile(url, LOGS_FILE_TMP_PATH);
  execSync(
    `rm -rf Host_Machine_Files && unzip ${LOGS_FILE_TMP_PATH} && rm ${LOGS_FILE_TMP_PATH} && mv Host_Machine_Files/\\$DEVICEFARM_LOG_DIR/*.json ${reportDestinationPath} && rm -rf Host_Machine_Files`
  );
  Logger.success(
    `Results available, run "npx @perf-profiler/web-reporter ${reportDestinationPath}" to see them`
  );
};
