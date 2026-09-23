import AdmZip from "adm-zip";
import fs from "fs";
import os from "os";
import path from "path";
import { unzip } from "../src/unzip";

const buildZip = (zipPath: string, entries: { name: string; content: string }[]) => {
  const zip = new AdmZip();
  for (const entry of entries) {
    zip.addFile(entry.name, Buffer.from(entry.content));
  }
  zip.writeZip(zipPath);
};

describe("unzip", () => {
  let tmpFolder: string;
  let destination: string;
  let zipPath: string;

  beforeEach(() => {
    tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), "flashlight-unzip-"));
    destination = path.join(tmpFolder, "out");
    zipPath = path.join(tmpFolder, "archive.zip");
    fs.mkdirSync(destination);
  });

  afterEach(() => {
    fs.rmSync(tmpFolder, { recursive: true, force: true });
  });

  it("extracts files to the destination folder", () => {
    buildZip(zipPath, [
      { name: "results.json", content: '{"name":"Report"}' },
      { name: "logs.txt", content: "some logs" },
    ]);

    unzip(zipPath, destination);

    expect(fs.readFileSync(path.join(destination, "results.json")).toString()).toBe(
      '{"name":"Report"}'
    );
    expect(fs.readFileSync(path.join(destination, "logs.txt")).toString()).toBe("some logs");
  });

  it("flattens nested entries to their file name", () => {
    // Device Farm artifacts nest results under the log directory
    buildZip(zipPath, [
      { name: "Host_Machine_Files/$DEVICEFARM_LOG_DIR/results.json", content: "{}" },
    ]);

    unzip(zipPath, destination);

    expect(fs.readdirSync(destination)).toEqual(["results.json"]);
  });

  it("does not write outside the destination folder", () => {
    buildZip(zipPath, [{ name: "../../escaped.json", content: "{}" }]);

    unzip(zipPath, destination);

    expect(fs.readdirSync(destination)).toEqual(["escaped.json"]);
    expect(fs.existsSync(path.join(tmpFolder, "escaped.json"))).toBe(false);
  });

  it("skips directory entries", () => {
    const zip = new AdmZip();
    zip.addFile("videos/", Buffer.alloc(0));
    zip.addFile("videos/video.mp4", Buffer.from("video"));
    zip.writeZip(zipPath);

    unzip(zipPath, destination);

    expect(fs.readdirSync(destination)).toEqual(["video.mp4"]);
  });
});
