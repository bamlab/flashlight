import React from "react";
import { roundToDecimal } from "../../../utils/roundToDecimal";

type Props = {
  value?: number;
  baseline?: number;
  hasValueImproved?: (difference: number) => boolean;
};

export const isDifferenceNegative = (difference: number) => difference <= 0;
export const isDifferencePositive = (difference: number) => difference >= 0;

export const Difference = ({ value, baseline, hasValueImproved = isDifferenceNegative }: Props) => {
  if (!value || !baseline) {
    return null;
  }

  const difference = roundToDecimal(((value - baseline) / baseline) * 100, 0);

  const improved = hasValueImproved(difference);
  const needsPlusSign = difference >= 0;

  const classNames = [`whitespace-pre ml-2`, improved ? "text-green-500" : "text-red-500"];

  return (
    <div className={classNames.join(" ")}>{`(${needsPlusSign ? "+" : ""}${difference}%)`}</div>
  );
};
