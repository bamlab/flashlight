import React, { useMemo, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../../theme/colors";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { AnnotationInterval, LineSeriesType } from "./types";
import { getAnnotations } from "./getAnnotations";

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
  formatter,
  onPointClick,
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
  formatter?: (label: string) => string;
  onPointClick?: (seriesIndex: number, dataPointIndex: number) => void;
}) => {
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    lastX: getLastX(series),
  });

  const videoEnabled = useContext(VideoEnabledContext);

  const options: ApexOptions = useMemo(
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
          markerClick: (event, chart, { seriesIndex, dataPointIndex }) => {
            onPointClick?.(seriesIndex, dataPointIndex);
          },
          ...(videoEnabled ? setVideoCurrentTimeOnMouseHover : {}),
        },
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
        labels: {
          style: { colors: "#FFFFFF99" },
          formatter: (label) => formatter?.(label ?? "") ?? label,
        },
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
      timeLimit,
      maxValue,
      showLegendForSingleSeries,
      colors,
      annotationIntervalList,
      setVideoCurrentTimeOnMouseHover,
      videoEnabled,
      formatter,
      onPointClick,
    ]
  );

  return <ReactApexChart options={options} series={series} type={"line"} height={height} />;
};
