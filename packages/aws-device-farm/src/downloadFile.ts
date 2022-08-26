import { Logger } from "@perf-profiler/logger";
import { execSync } from "child_process";

export const downloadFile = async (
  url: string,
  destinationFilePath: string
) => {
  Logger.info(`Downloading ${destinationFilePath}...`);

  execSync(`curl "${url}" -o ${destinationFilePath}`);

  Logger.success(`Download of ${destinationFilePath} done`);
};
