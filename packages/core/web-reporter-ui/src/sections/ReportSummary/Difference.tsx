import React from "react";
import { roundToDecimal } from "../../../utils/roundToDecimal";

type Props = {
  value?: number;
  baseline?: number;
};

export const Difference = ({ value, baseline }: Props) => {
  if (!value || !baseline) {
    return null;
  }

  const difference = roundToDecimal(((value - baseline) / baseline) * 100, 0);

  const improved = difference <= 0;
  const needsPlusSign = difference >= 0;

  const classNames = [`whitespace-pre ml-2`, improved ? "text-green-500" : "text-red-500"];

  return (
    <div className={classNames.join(" ")}>{`(${needsPlusSign ? "+" : ""}${difference}%)`}</div>
  );
};
