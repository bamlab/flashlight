import { saveAs } from "file-saver";
import JSZip = require("jszip");
import { TestCaseResult } from "@perf-profiler/types";

const DEFAULT_EXPORT_EXTENSION = ".json";
const DEFAULT_FILE_NAME_SEPARATOR = "_";

const getTimeStampAsString = () => {
  const nowDate = Date.now();
  return nowDate.toString();
};

export const exportRawDataToJSON = (
  fileName: string,
  rawData: TestCaseResult[] | TestCaseResult
) => {
  const timeStampAsString = getTimeStampAsString();

  const exportFileName = `${fileName}${DEFAULT_FILE_NAME_SEPARATOR}${timeStampAsString}${DEFAULT_EXPORT_EXTENSION}`;

  const blob = new Blob([JSON.stringify(rawData)], {
    type: "text/plain;charset=utf-8",
  });

  saveAs(blob, exportFileName);
};

export const exportRawDataToZIP = (rawData: TestCaseResult[]) => {
  const zip = new JSZip();

  const timeStampAsString = getTimeStampAsString();

  rawData.forEach((report) => {
    const exportFileName = `${report.name}${DEFAULT_FILE_NAME_SEPARATOR}${timeStampAsString}${DEFAULT_EXPORT_EXTENSION}`;
    zip.file(exportFileName, JSON.stringify(report));
  });

  zip.generateAsync({ type: "blob" }).then((content: Blob) => {
    saveAs(
      content,
      `results${DEFAULT_FILE_NAME_SEPARATOR}${timeStampAsString}.zip`
    );
  });
};
