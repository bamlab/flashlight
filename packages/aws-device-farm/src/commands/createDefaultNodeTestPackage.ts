import { UploadType } from "@aws-sdk/client-device-farm";
import fs from "fs";
import { Logger } from "@perf-profiler/logger";
import { execSync } from "child_process";
import { zipTestFolder } from "../zipTestFolder";
import { uploadRepository } from "../repositories";

export const DEFAULT_TEST_PACKAGE_NAME =
  "__PERF_PROFILER_SINGLE_FILE__DEFAULT_TEST_FOLDER__";

export const createDefaultNodeTestPackage = async ({
  projectArn,
}: {
  projectArn: string;
}) => {
  const testFolder = `/tmp/${DEFAULT_TEST_PACKAGE_NAME}`;
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
    name: DEFAULT_TEST_PACKAGE_NAME,
    filePath: testFolderZipPath,
    type: UploadType.APPIUM_NODE_TEST_PACKAGE,
  });
  fs.rmSync(testFolder, { force: true, recursive: true });

  return arn;
};
