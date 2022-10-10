import path from "path";
import { execSync } from "child_process";
import { Logger } from "@perf-profiler/logger";

export const zipTestFolder = (folderPath: string) => {
  Logger.info(`Bundling test folder into tar.gz...`);
  execSync(`cd ${folderPath} && npm i -g npm-bundle && npm-bundle`);
  Logger.info(`Compressing into zip`);

  const zipPath = `${path.basename(path.resolve(folderPath))}.zip`;
  execSync(
    `cd ${folderPath} && zip -r ${zipPath} *.tgz && rm ${folderPath}/*.tgz`
  );
  Logger.success(`Zip created, ready for upload: ${zipPath}`);

  return `${folderPath}/${zipPath}`;
};
