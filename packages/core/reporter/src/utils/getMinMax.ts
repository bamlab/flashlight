import { roundToDecimal } from "./round";

export const getMinMax = (values: number[]): [number, number] => {
  const roundedMinMax = [Math.min(...values), Math.max(...values)].map(roundToDecimal);
  return [roundedMinMax[0], roundedMinMax[1]];
};
