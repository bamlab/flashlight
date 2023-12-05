export const roundToDecimal = (value: number, decimalCount = 1) => {
  const factor = Math.pow(10, decimalCount);
  return Math.round(value * factor) / factor;
};
