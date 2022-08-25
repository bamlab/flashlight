import { getRAMPageSize } from "../cppProfiler";

const BYTES_PER_MB = 1024 * 1024;
const RAM_PAGE_SIZE = getRAMPageSize();

export const getCommand = (pid: string) => `cat /proc/${pid}/statm`;

export const processOutput = (result: string) => {
  return (parseInt(result.split(" ")[1], 10) * RAM_PAGE_SIZE) / BYTES_PER_MB;
};
