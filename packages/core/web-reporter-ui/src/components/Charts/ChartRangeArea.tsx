import { ApexOptions } from "apexcharts";
import React, { useMemo } from "react";
import { RangeAreaSeriesType } from "./types";
import { Chart } from "./Chart";

/**
 * @description
 * ChartRangeArea is a chart used to display the deviation range of a metric.
 * @param series is an array of objects where type 'line' comes first and type 'rangeArea' comes second.
 */
export const ChartRangeArea = ({
  title,
  series,
  height,
  colors,
  formatter,
}: {
  title: string;
  series: RangeAreaSeriesType;
  height: number;
  colors: string[];
  formatter?: (label: string) => string;
}) => {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        animations: {
          enabled: false,
          easing: undefined,
          dynamicAnimation: undefined,
        },
      },
      stroke: {
        width: [...Array(series.length / 2).fill(2), ...Array(series.length / 2).fill(0)],
      },
      xaxis: {
        type: "category",
        min: 0,
        labels: {
          formatter: (label = "") => formatter?.(label) ?? label,
        },
      },
      yaxis: { min: 0 },
    }),
    [series.length, formatter]
  );

  return (
    <Chart
      type="rangeArea"
      title={title}
      series={series}
      height={height}
      colors={colors}
      options={options}
    />
  );
};
