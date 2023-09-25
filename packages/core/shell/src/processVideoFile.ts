import { spawn } from "child_process";

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
  );
};
