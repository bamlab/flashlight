import React from "react";
import { SummaryStats } from "./SummaryStats";

export const ThreadStats = ({
  stats,
}: {
  stats: {
    [threadName: string]: {
      minMaxRange: [number, number];
      deviationRange: [number, number];
      variationCoefficient: number;
    };
  };
}) => {
  return (
    <div className="flex flex-col">
      {Object.keys(stats).map((threadName) => (
        <div className="text-neutral-300 text-sm" key={threadName}>
          - {threadName} -
          <SummaryStats stats={stats[threadName]} unit="ms" />
        </div>
      ))}
    </div>
  );
};
