import React, { useMemo } from "react";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { merge } from "lodash";

export const Chart = ({
  type,
  title,
  series,
  options = {},
  height,
  colors,
}: {
  type: Exclude<ApexChartProps["type"], undefined>;
  title: string;
  series: ApexAxisChartSeries;
  options?: ApexOptions;
  height: number;
  colors?: string[];
}) => {
  const commonOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: title,
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: POLLING_INTERVAL,
          },
        },
        zoom: {
          enabled: false,
        },
      },
      title: {
        text: title,
        align: "left",
        style: {
          color: "#FFFFFF",
          fontSize: "24px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        labels: {
          style: { colors: "#FFFFFF99" },
        },
      },
      yaxis: {
        labels: { style: { colors: "#FFFFFF99" } },
      },
      colors,
      legend: {
        labels: {
          colors: "#FFFFFF99",
        },
      },
      grid: {
        borderColor: "#FFFFFF33",
        strokeDashArray: 3,
      },
    }),
    [colors, title]
  );

  const chartOptions = useMemo(() => merge(commonOptions, options), [commonOptions, options]);

  return <ReactApexChart options={chartOptions} series={series} type={type} height={height} />;
};
