import { ArtifactType, UploadType } from "@aws-sdk/client-device-farm";
import fs from "fs";
import { Logger } from "@perf-profiler/logger";
import { execSync } from "child_process";
import { createTestSpecFile } from "./createTestSpecFile";
import { downloadFile } from "./utils/downloadFile";
import { zipTestFolder } from "./zipTestFolder";
import { unzip } from "./utils/unzip";
import { TMP_FOLDER } from "./TMP_FOLDER";
import {
  devicePoolRepository,
  projectRepository,
  testRepository,
  uploadRepository,
} from "./repositories";

const NAME = "__PERF_PROFILER_SINGLE_FILE__DEFAULT_TEST_FOLDER__";

const _createDefaultNodeTestPackage = async ({
  projectArn,
}: {
  projectArn: string;
}) => {
  const testFolder = `/tmp/${NAME}`;
  fs.rmSync(testFolder, { force: true, recursive: true });
  fs.mkdirSync(testFolder);

  const SAMPLE_PACKAGE_JSON = `{
    "name": "test-folder",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
      "@bam.tech/appium-helper": "latest",
      "@perf-profiler/appium-test-cases": "latest",
      "@perf-profiler/e2e": "latest"
    },
    "bundledDependencies": [
      "@bam.tech/appium-helper",
      "@perf-profiler/appium-test-cases",
      "@perf-profiler/e2e"
    ]
  }`;

  fs.writeFileSync(`${testFolder}/package.json`, SAMPLE_PACKAGE_JSON);
  Logger.info("Installing profiler dependencies in test package...");
  execSync(`cd ${testFolder} && npm install`);

  const testFolderZipPath = zipTestFolder(testFolder);

  const arn = await uploadRepository.upload({
    projectArn,
    name: NAME,
    filePath: testFolderZipPath,
    type: UploadType.APPIUM_NODE_TEST_PACKAGE,
  });
  fs.rmSync(testFolder, { force: true, recursive: true });

  return arn;
};

export const createDefaultNodeTestPackage = async ({
  projectName,
}: {
  projectName: string;
}) => {
  const projectArn = await projectRepository.getOrCreate({ name: projectName });
  return _createDefaultNodeTestPackage({ projectArn });
};

const getSingleFileTestFolderArn = async ({
  projectArn,
}: {
  projectArn: string;
}) => {
  const testPackageArn = (
    await uploadRepository.getByName({
      projectArn,
      name: NAME,
      type: UploadType.APPIUM_NODE_TEST_PACKAGE,
    })
  )?.arn;

  if (testPackageArn) {
    Logger.success("Found test folder with performance profiler upload");
    return testPackageArn;
  } else {
    return _createDefaultNodeTestPackage({ projectArn });
  }
};

export const runTest = async ({
  projectName,
  apkPath,
  testSpecsPath,
  testFolder,
  testName,
  testCommand,
  deviceName,
  apkUploadArn: apkUploadArnGiven,
  testFile,
}: {
  projectName: string;
  apkPath: string;
  testSpecsPath: string;
  testFolder: string;
  testName: string;
  testCommand: string;
  deviceName: string;
  apkUploadArn?: string;
  testFile?: string;
}): Promise<string> => {
  const projectArn = await projectRepository.getOrCreate({ name: projectName });
  const devicePoolArn = await devicePoolRepository.getOrCreate({
    projectArn,
    deviceName,
  });

  let testPackageArn = null;
  if (testFile) {
    testPackageArn = await getSingleFileTestFolderArn({ projectArn });
  } else {
    const testFolderZipPath = zipTestFolder(testFolder);
    testPackageArn = await uploadRepository.upload({
      projectArn,
      filePath: testFolderZipPath,
      type: UploadType.APPIUM_NODE_TEST_PACKAGE,
    });
  }

  const apkUploadArn =
    apkUploadArnGiven ||
    (await uploadRepository.upload({
      projectArn,
      filePath: apkPath,
      type: UploadType.ANDROID_APP,
    }));

  const newTestSpecPath = createTestSpecFile({
    testSpecsPath,
    testCommand,
    testFile,
  });
  const testSpecArn = await uploadRepository.upload({
    projectArn,
    filePath: newTestSpecPath,
    type: UploadType.APPIUM_NODE_TEST_SPEC,
  });
  fs.rmSync(newTestSpecPath);

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
  const tmpFolder = `${TMP_FOLDER}/${new Date().getTime()}`;
  fs.mkdirSync(tmpFolder);

  const LOGS_FILE_TMP_PATH = `${tmpFolder}/logs.zip`;
  await downloadFile(url, LOGS_FILE_TMP_PATH);

  unzip(LOGS_FILE_TMP_PATH, tmpFolder);
  execSync(
    `rm ${LOGS_FILE_TMP_PATH} && mv ${tmpFolder}/*.json ${reportDestinationPath} && rm -rf ${tmpFolder}`
  );
  Logger.success(
    `Results available, run "npx @perf-profiler/web-reporter ${reportDestinationPath}" to see them`
  );
};

export const uploadApk = async ({
  apkPath,
  projectName,
}: {
  apkPath: string;
  projectName: string;
}) => {
  const projectArn = await projectRepository.getOrCreate({
    name: projectName,
  });

  const apkUploadArn = await uploadRepository.upload({
    projectArn,
    filePath: apkPath,
    type: UploadType.ANDROID_APP,
  });

  Logger.success(`APK uploaded: ${apkUploadArn}`);
};
