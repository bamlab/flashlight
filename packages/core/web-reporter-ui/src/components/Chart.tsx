import React, { useMemo, useContext, useRef } from "react";
import ReactApexChart, { Props as ApexProps } from "react-apexcharts";
import { VideoEnabledContext, setVideoCurrentTime } from "../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../theme/colors";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { getLastX, useSetVideoTimeOnMouseHover } from "./Charts/useSetVideoTimeOnMouseHover";
import { LineSeriesType } from "./Charts/types";

type AnnotationInterval = {
  y: number;
  y2: number;
  label: string;
  color: string;
};

const getAnnotationInterval = (annotationIntervalList: AnnotationInterval[]) => {
  const layout = annotationIntervalList?.map(({ y, y2, label, color }) => ({
    y,
    y2,
    borderColor: color,
    fillColor: color,
    opacity: 0.2,
    label: {
      borderColor: color,
      style: {
        color: "#fff",
        background: color,
      },
      text: label,
    },
  }));
  return layout;
};

const getVideoCurrentTimeAnnotation = () => {
  const palette = getColorPalette();
  const lastColor = palette[palette.length - 1];

  return [
    {
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
    },
  ];
};

const getAnnotations = (annotationIntervalList: AnnotationInterval[] | undefined) => {
  if (!annotationIntervalList) return;

  const xaxis = getVideoCurrentTimeAnnotation();
  const yaxis = getAnnotationInterval(annotationIntervalList);
  if (!xaxis.length || !yaxis.length) return undefined;

  return { xaxis, yaxis };
};

export const Chart = ({
  title,
  series,
  height,
  interval = POLLING_INTERVAL,
  timeLimit,
  maxValue,
  showLegendForSingleSeries,
  colors = getColorPalette(),
  annotationIntervalList = undefined,
}: {
  title: string;
  series: LineSeriesType;
  height: number;
  interval?: number;
  timeLimit?: number | null;
  maxValue?: number;
  showLegendForSingleSeries?: boolean;
  colors?: string[];
  annotationIntervalList?: AnnotationInterval[];
}) => {
  const lastX = series[0]?.data.at(-1)?.x;
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    lastX: getLastX(series),
  });

  const videoEnabled = useContext(VideoEnabledContext);

  const options: ApexOptions = {
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
    annotations: getAnnotations(annotationIntervalList) || {},
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
  };

  return <ReactApexChart options={options} series={series} type={"line"} height={height} />;
};
