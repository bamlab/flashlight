import { UploadType } from "@aws-sdk/client-device-farm";
import path from "path";
import fs from "fs";
import { Logger } from "@perf-profiler/logger";
import { createTestSpecFile } from "../createTestSpecFile";
import { zipTestFolder } from "../zipTestFolder";
import {
  devicePoolRepository,
  projectRepository,
  testRepository,
  uploadRepository,
} from "../repositories";
import {
  createDefaultNodeTestPackage,
  DEFAULT_TEST_PACKAGE_NAME,
} from "./createDefaultNodeTestPackage";

export const DEFAULT_RUN_TEST_OPTIONS = {
  testFolder: ".",
  testSpecsPath: path.join(__dirname, "..", "flashlight.yml"),
  projectName: "Flashlight",
  testName: "Flashlight",
  reportDestinationPath: ".",
  deviceName: "A10s",
};

const getSingleFileTestFolderArn = async ({
  projectArn,
}: {
  projectArn: string;
}) => {
  const testPackageArn = (
    await uploadRepository.getByName({
      projectArn,
      name: DEFAULT_TEST_PACKAGE_NAME,
      type: UploadType.APPIUM_NODE_TEST_PACKAGE,
    })
  )?.arn;

  if (testPackageArn) {
    Logger.success("Found test folder with performance profiler upload");
    return testPackageArn;
  } else {
    return createDefaultNodeTestPackage({ projectArn });
  }
};

export const runTest = async ({
  projectName = DEFAULT_RUN_TEST_OPTIONS.projectName,
  apkPath,
  testSpecsPath = DEFAULT_RUN_TEST_OPTIONS.testSpecsPath,
  testFolder = DEFAULT_RUN_TEST_OPTIONS.testFolder,
  testName = DEFAULT_RUN_TEST_OPTIONS.testName,
  testCommand,
  deviceName = DEFAULT_RUN_TEST_OPTIONS.deviceName,
  apkUploadArn: apkUploadArnGiven,
  testFile,
  postTestCommand,
}: {
  projectName?: string;
  apkPath?: string;
  testSpecsPath?: string;
  testFolder?: string;
  testName?: string;
  testCommand?: string;
  deviceName?: string;
  apkUploadArn?: string;
  testFile?: string;
  postTestCommand?: string;
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

  let apkUploadArn;

  if (apkUploadArnGiven) {
    apkUploadArn = apkUploadArnGiven;
  } else if (apkPath) {
    apkUploadArn = await uploadRepository.upload({
      projectArn,
      filePath: apkPath,
      type: UploadType.ANDROID_APP,
    });
  } else {
    throw new Error("Neither apkUploadArn nor apkPath was passed.");
  }

  const newTestSpecPath = createTestSpecFile({
    testSpecsPath,
    testCommand,
    testFile,
    postTestCommand,
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
