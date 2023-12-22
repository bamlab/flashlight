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

const getFFMpegBinaryPath = () => {
  switch (process.platform) {
    case "darwin":
      switch (process.arch) {
        case "arm64":
          return `https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v4.4.1/ffmpeg-4.4.1-osx-64.zip`;
      }
    case "linux":
      switch (process.arch) {
        case "x64":
          return `https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v4.4.1/ffmpeg-4.4.1-linux-64.zip`;
      }
  }

  throw new Error(`Unsupported os ${process.platform}-${process.arch} to install FFMpeg`);
};

export const installFFMpeg = async () => {
  await execAsync(`mkdir -p ${FFMPEG_BINARY_FOLDER_PATH}`);

  // Download ffmpeg binary
  await downloadFile(getFFMpegBinaryPath(), `${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg.zip`);

  unzip(FFMPEG_BINARY_FOLDER_PATH + "/ffmpeg.zip", FFMPEG_BINARY_FOLDER_PATH);

  // Make the binary executable
  await execAsync(`chmod +rwx ${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg`);
};

export const processVideoFile = async (filePath: string, destinationPath: string) => {
  const ffmpegExecutable = fs.existsSync(`${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg`)
    ? `${FFMPEG_BINARY_FOLDER_PATH}/ffmpeg`
    : "ffmpeg";

  // When coming from AWS Device Farm or certain devices, it seems the video is not encoded properly
  // VSync 0 is important since we have variable frame rate from adb shell screenrecord
  await execAsync(
    `${ffmpegExecutable} -y -vsync 0 -i ${filePath} -c:v libx264 -crf 23 -c:a aac -b:a 128k ${destinationPath} -loglevel error`
  );
};
