import { execSync } from "child_process";
import { Logger } from "@perf-profiler/logger";

const getOpenReportCommand = () => {
  switch (process.platform) {
    case "darwin":
      return "open";
    case "win32":
      return "start";
    default:
      return "xdg-open";
  }
};

export const open = (path: string) => {
  try {
    execSync(`${getOpenReportCommand()} ${path}`);
  } catch {
    Logger.warn(`Failed to run "open ${path}"`);
  }
};
