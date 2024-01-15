import fs from "fs";
import os from "os";

const tmpFiles: string[] = [];

export const writeTmpFile = (fileName: string, content: string): string => {
  const tmpPath = getTmpFilePath(fileName);
  fs.writeFileSync(tmpPath, content);
  return tmpPath;
};

export const getTmpFilePath = (fileName: string) => {
  const filePath = `${os.tmpdir()}/${fileName}`;
  tmpFiles.push(filePath);

  return filePath;
};

export const removeTmpFiles = () => {
  for (const tmpFile of tmpFiles) {
    fs.rmSync(tmpFile, { recursive: true });
  }
  tmpFiles.splice(0, tmpFiles.length);
};
