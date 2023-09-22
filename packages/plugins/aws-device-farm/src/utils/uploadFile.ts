import { Logger } from "@perf-profiler/logger";
import { execSync } from "child_process";

export const uploadFile = async (url: string, filePath: string) => {
  Logger.info(`Uploading ${filePath}...`);
  execSync(
    `curl -T ${filePath} "${url}" --fail --progress-bar -o /tmp/upload_${new Date().getTime()}.txt`,
    { stdio: "inherit" }
  );
  Logger.info(`Upload of ${filePath} done`);
};
