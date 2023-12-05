import { roundToDecimal } from "./round";

export const getStandardDeviation = ({
  values,
  average,
}: {
  values: number[];
  average: number;
}): {
  deviation: number;
  deviationRange: [number, number];
} => {
  const variance =
    values.reduce((acc, val) => {
      const ecart = val - average;
      return acc + ecart * ecart;
    }, 0) / values.length;

  const deviation = Math.sqrt(variance);
  const range: [number, number] = [average - deviation, average + deviation];

  const roundedDeviation = range.map(roundToDecimal);
  return {
    deviation: deviation,
    deviationRange: [roundedDeviation[0], roundedDeviation[1]],
  };
};
