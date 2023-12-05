import React from "react";

type SummaryStatsProps = {
  stats: {
    deviationRange: [number, number];
    minMaxRange: [number, number];
    variationCoefficient: number;
  };
  unit: string;
};

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  stats: { deviationRange, minMaxRange, variationCoefficient },
  unit,
}) => {
  return (
    <>
      <div className="text-neutral-300 text-sm">
        Min Max Range:{" "}
        <span className="text-neutral-400 text-sm">
          {minMaxRange[0]} {unit} to {minMaxRange[1]} {unit}
        </span>
      </div>
      <div className="text-neutral-300 text-sm">
        Standard deviation range :{" "}
        <span className="text-neutral-400 text-sm">
          {deviationRange[0]} {unit} to {deviationRange[1]} {unit}
        </span>
      </div>
      <div className="text-neutral-300 text-sm">
        Coefficient of variation :{" "}
        <span className="text-neutral-400 text-sm">{variationCoefficient} %</span>
      </div>
      <div className="h-2" />
    </>
  );
};
