import { spawn } from "child_process";
import { downloadFile } from "./downloadFile";
import { unzip } from "./unzip";
import fs from "fs";

const FFMPEG_BINARY_FOLDER_PATH = "/tmp/ffmpeg-binary";

const execAsync = (command: string) =>
  new Promise<void>((resolve, reject) => {
    const parts = command.split(" ");
    const proc = spawn(parts[0], parts.slice(1));

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command ${command} failed with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on("error", reject);
  });

export const processVideoFile = async (filePath: string, destinationPath: string) => {
  // When coming from AWS Device Farm or certain devices, it seems the video is not encoded properly
  // VSync 0 is important since we have variable frame rate from adb shell screenrecord
  await execAsync(
    `ffmpeg -y -vsync 0 -i ${filePath} -c:v libx264 -crf 23 -c:a aac -b:a 128k ${destinationPath} -loglevel error`
  ).catch(async (err) => {
    // If the error is ENOENT, then it suggests that ffmpeg is not installed. It could be the case
    // since the ffmpeg package is not available on AWS machines with Node 18.
    if (err.code === "ENOENT") {
      if (!fs.existsSync(`${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg`)) {
        await execAsync(`mkdir -p ${FFMPEG_BINARY_FOLDER_PATH}`);

        // Download ffmpeg binary
        await downloadFile(
          // "https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v4.4.1/ffmpeg-4.4.1-linux-32.zip",
          "https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v4.4.1/ffmpeg-4.4.1-osx-64.zip",
          FFMPEG_BINARY_FOLDER_PATH + "/ffmpeg.zip"
        );

        unzip(FFMPEG_BINARY_FOLDER_PATH + "/ffmpeg.zip", FFMPEG_BINARY_FOLDER_PATH);

        // Make the binary executable
        await execAsync(`chmod +rwx ${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg`);
      }

      await execAsync(
        `${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg -y -vsync 0 -i ${filePath} -c:v libx264 -crf 23 -c:a aac -b:a 128k ${destinationPath} -loglevel error`
      );
    }
  });
};
