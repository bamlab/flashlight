import fs from "fs";
import axios from "axios";
import { Logger } from "@perf-profiler/logger";

export const uploadFile = async (url: string, filePath: string) => {
  Logger.info(`Uploading ${filePath}...`);

  const read_stream = fs.createReadStream(filePath);
  const { size } = fs.statSync(filePath);

  await axios({
    method: "put",
    url: url,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      "Content-Length": size,
    },
    data: read_stream,
    onUploadProgress: (progressEvent) => console.log(progressEvent),
  });

  Logger.info(`Upload of ${filePath} done`);
};
