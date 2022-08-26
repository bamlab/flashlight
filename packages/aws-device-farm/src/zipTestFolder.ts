import path from "path";
import { execSync } from "child_process";
import { Logger } from "@perf-profiler/logger";

export const zipTestFolder = (folderPath: string) => {
  Logger.info(`Bundling test folder into tar.gz...`);
  execSync(`cd ${folderPath} && npm i -g npm-bundle && npm-bundle`);
  Logger.info(`Compressing into zip`);

  const zipPath = `${path.basename(path.resolve(folderPath))}.zip`;
  execSync(`zip -r ${zipPath} ${folderPath}/*.tgz && rm ${folderPath}/*.tgz`);
  Logger.success(`Zip created: ${zipPath}`);

  return zipPath;
};
