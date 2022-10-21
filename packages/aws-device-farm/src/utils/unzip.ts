// AWS Lamda doesn't have unzip
import AdmZip from "adm-zip";
import fs from "fs";

export const unzip = (path: string, destinationFolder: string) => {
  const zip = new AdmZip(path);
  const zipEntries = zip.getEntries();

  for (const zipEntry of zipEntries) {
    const parts = zipEntry.entryName.split("/");

    fs.writeFileSync(
      `${destinationFolder}/${parts[parts.length - 1]}`,
      zipEntry.getData().toString("utf8")
    );
  }
};
