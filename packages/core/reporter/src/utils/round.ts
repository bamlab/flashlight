export const round = (n: number, decimals: number) =>
  Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals);

export const roundToDecimal = (value: number, decimalCount = 1) => {
  const factor = Math.pow(10, decimalCount);
  return Math.round(value * factor) / factor;
};
