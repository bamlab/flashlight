import React, { useMemo, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import {
  VideoEnabledContext,
  setVideoCurrentTime,
} from "../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../theme/colors";

const getVideoCurrentTimeAnnotation = () => {
  const palette = getColorPalette();
  const lastColor = palette[palette.length - 1];

  return {
    x: 0,
    strokeDashArray: 0,
    borderColor: lastColor,
    label: {
      borderColor: lastColor,
      style: {
        color: "#fff",
        background: lastColor,
      },
      text: "Video",
      position: "right",
    },
  };
};

const useSetVideoTimeOnMouseHover = ({
  series,
}: {
  series: { name: string; data: { x: number; y: number }[] }[];
}): ApexChart["events"] => {
  return {
    mouseMove: (event, chart) => {
      if (series.length === 0) return;

      const lastX = series[0].data[series[0].data.length - 1].x;

      const totalWidth =
        chart.events.ctx.dimensions.dimXAxis.w.globals.gridWidth;

      const mouseX =
        event.clientX -
        chart.el.getBoundingClientRect().left -
        chart.w.globals.translateX;

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
  showLegendForSingleSeries,
  colors = getColorPalette(),
}: {
  title: string;
  series: { name: string; data: { x: number; y: number }[] }[];
  height: number;
  interval?: number;
  timeLimit?: number | null;
  maxValue?: number;
  showLegendForSingleSeries?: boolean;
  colors?: string[];
}) => {
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    series,
  });
  const videoEnabled = useContext(VideoEnabledContext);

  const options = useMemo<ApexOptions>(
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
        xaxis: videoEnabled ? [getVideoCurrentTimeAnnotation()] : [],
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
        width: 2,
      },
      xaxis: {
        type: "numeric",
        min: 0,
        max: timeLimit || undefined,
        labels: { style: { colors: "#FFFFFF99" } },
      },
      yaxis: {
        min: 0,
        max: maxValue,
        labels: { style: { colors: "#FFFFFF99" } },
      },
      colors,
      legend: {
        showForSingleSeries: showLegendForSingleSeries,
        labels: {
          colors: "#FFFFFF99",
        },
      },

      grid: {
        borderColor: "#FFFFFF33",
        strokeDashArray: 3,
      },
    }),
    [
      title,
      interval,
      videoEnabled,
      setVideoCurrentTimeOnMouseHover,
      timeLimit,
      maxValue,
      colors,
      showLegendForSingleSeries,
    ]
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
