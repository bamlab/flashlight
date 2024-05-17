const BYTES_PER_MB = 1024 * 1024;

export const processOutput = (result: string, ramPageSize: number) => {
  const lines = result.split("\n");
  let total = 0;

  for (const line of lines) {
    total += (parseInt(line.split(" ")[1], 10) * ramPageSize) / BYTES_PER_MB;
  }
  return total;
};
