import React, { useMemo, ComponentProps, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { PercentageDispatchContext } from "../context/PercentageContext";

export const PALETTE = ["#3a86ff", "#8338ec", "#ff006e", "#fb5607", "#ffbe0b"];

export const Chart = ({
  title,
  series,
  height,
  interval = 500,
  timeLimit,
  maxValue,
  colors = PALETTE,
}: {
  title: string;
  series: { name: string; data: { x: number; y: number }[] }[];
  height: number;
  interval?: number;
  timeLimit?: number | null;
  maxValue?: number;
  colors?: string[];
}) => {
  const dispatch = useContext(PercentageDispatchContext);

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
            speed: interval,
          },
        },
        events: {
          mouseMove(_, chart) {
            const totalWidth =
              chart.events.ctx.dimensions.dimXAxis.w.globals.gridWidth;
            const mouseX =
              chart.events.ctx.dimensions.dimXAxis.w.globals.clientX - 60;
            if (mouseX > totalWidth) return;

            dispatch({
              type: "change_value",
              payload: (mouseX * 100) / totalWidth,
            });
          },
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        intersect: true,
        shared: false,
      },
      markers: {
        size: 1,
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
      colors,
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
