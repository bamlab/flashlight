import React, { useMemo, ComponentProps, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import {
  VideoEnabledContext,
  useSetVideoCurrentTime,
} from "../videoCurrentTimeContext";

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

const useSetVideoTimeOnMouseHover = ({
  series,
}: {
  series: { name: string; data: { x: number; y: number }[] }[];
}): ApexChart["events"] => {
  const lastX = series[0].data[series[0].data.length - 1].x;
  const setVideoCurrentTime = useSetVideoCurrentTime();

  return {
    mouseMove: (event, chart) => {
      const totalWidth =
        chart.events.ctx.dimensions.dimXAxis.w.globals.gridWidth;

      const mouseX = Math.max(
        0,
        event.clientX -
          chart.el.getBoundingClientRect().left -
          chart.w.globals.translateX
      );

      const maxX = lastX;

      setVideoCurrentTime((mouseX / totalWidth) * maxX);

      // Manually translate via DOM to avoid re-rendering the chart
      const annotations = document.getElementsByClassName(
        "apexcharts-xaxis-annotations"
      );

      for (const annotation of annotations) {
        annotation.setAttribute("style", `transform: translateX(${mouseX}px);`);
      }
    },
  };
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
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    series,
  });
  const videoEnabled = useContext(VideoEnabledContext);

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
        events: videoEnabled ? setVideoCurrentTimeOnMouseHover : {},
        zoom: {
          enabled: false,
        },
      },
      annotations: {
        xaxis: videoEnabled ? [videoCurrentTimeAnnotation] : [],
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
