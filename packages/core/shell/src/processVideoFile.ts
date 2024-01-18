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

const FFMPEG_VERSION = "4.4.1";
const archToExec: Partial<Record<`${NodeJS.Platform}-${NodeJS.Architecture}`, string>> = {
  "darwin-arm64": "osx-64",
  "darwin-x64": "osx-64",
  "linux-x64": "linux-64",
};

const getFFMpegBinaryPath = () => {
  const archKey = `${process.platform}-${process.arch}` as const;

  if (archKey in archToExec)
    return `https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}-${archToExec[archKey]}.zip`;

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
