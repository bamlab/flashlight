import { roundToDecimal } from "./round";

export const variationCoefficient = (average: number, standardDeviation: number) => {
  return average > 0 ? roundToDecimal((standardDeviation / average) * 100) : 0;
};
