// AWS Lamda doesn't have unzip
import AdmZip from "adm-zip";
import fs from "fs";

export const unzip = (path: string, destinationFolder: string) => {
  const zip = new AdmZip(path);
  zip.getEntries().forEach((zipEntry) => {
    if (!zipEntry.isDirectory) {
      const parts = zipEntry.entryName.split("/");
      fs.writeFileSync(`${destinationFolder}/${parts[parts.length - 1]}`, zipEntry.getData());
    }
  });
};
