export const roundToDecimal = (value: number, decimalCount: number) => {
  const factor = Math.pow(10, decimalCount);
  return Math.round(value * factor) / factor;
};
