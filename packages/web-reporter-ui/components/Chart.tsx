import React, { useMemo, ComponentProps } from "react";
import ReactApexChart from "react-apexcharts";
import { useSetVideoCurrentTime } from "../videoCurrentTimeContext";

export const PALETTE = ["#3a86ff", "#8338ec", "#ff006e", "#fb5607", "#ffbe0b"];

const videoCurrentTimeAnnotation = {
  x: 0,
  strokeDashArray: 0,
  borderColor: PALETTE[1],
  label: {
    borderColor: PALETTE[1],
    style: {
      color: "#fff",
      background: PALETTE[1],
    },
    text: "Video",
    position: "right",
  },
};

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
  const setVideoCurrentTime = useSetVideoCurrentTime();

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
          // click(e, chart, options) {
          //use that if you want to change on hover
          mouseMove(event, chart) {
            const totalWidth =
              chart.events.ctx.dimensions.dimXAxis.w.globals.gridWidth;

            const mouseX = Math.max(
              0,
              event.clientX -
                chart.el.getBoundingClientRect().left -
                chart.w.globals.translateX
            );

            const lastX = series[0].data[series[0].data.length - 1].x;
            const maxX = lastX;

            setVideoCurrentTime((mouseX / totalWidth) * maxX);

            // Manually translate via DOM to avoid re-rendering the chart
            const annotations = document.getElementsByClassName(
              "apexcharts-xaxis-annotations"
            );

            for (const annotation of annotations) {
              annotation.setAttribute(
                "style",
                `transform: translateX(${mouseX}px);`
              );
            }
          },
        },
        zoom: {
          enabled: false,
        },
      },
      annotations: {
        xaxis: [videoCurrentTimeAnnotation],
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
