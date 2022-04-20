import React, { useMemo, ComponentProps } from "react";
import ReactApexChart from "react-apexcharts";

export const Chart = ({
  title,
  series,
  height,
  interval,
  timeLimit,
  maxValue,
}: {
  title: string;
  series: { name: string; data: { x: number; y: number }[] }[];
  height: number;
  interval: number;
  timeLimit?: number | null;
  maxValue?: number;
}) => {
  const options = useMemo<ComponentProps<typeof ReactApexChart>["options"]>(
    () => ({
      chart: {
        id: title,
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: interval + 200,
          },
        },
        zoom: {
          enabled: false,
        },
      },
      title: {
        text: title,
        align: "left",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: timeLimit
        ? { type: "numeric", min: 0, max: timeLimit }
        : { type: "numeric", min: 0, max: undefined },
      yaxis: {
        min: 0,
        max: maxValue,
      },
      // colors: [color],
    }),
    [title, timeLimit]
  );

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={height}
    />
  );
};
