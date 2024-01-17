import React, { useMemo, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../../theme/colors";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { AnnotationInterval, LineSeriesType } from "./types";
import { getAnnotations } from "./getAnnotations";
import { merge } from "lodash";

export const Chart = ({
  title,
  series,
  height,
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

  const options: ApexOptions = useMemo(
    () =>
      merge(commonOptions, {
        chart: {
          type: "line",
          events: {
            markerClick: (
              _event: unknown,
              _chart: unknown,
              { seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }
            ) => {
              onPointClick?.(seriesIndex, dataPointIndex);
            },
            ...(videoEnabled ? setVideoCurrentTimeOnMouseHover : {}),
          },
          zoom: {
            enabled: false,
          },
        },
        annotations: getAnnotations(annotationIntervalList) || {},
        stroke: {
          width: 2,
        },
        xaxis: {
          type: "category",
          max: timeLimit || undefined,
          labels: {
            formatter: (label: string | undefined) => formatter?.(label ?? "") ?? label,
          },
        },
        yaxis: {
          min: 0,
          max: maxValue,
        },
        legend: {
          showForSingleSeries: showLegendForSingleSeries,
        },
      }),
    [
      commonOptions,
      videoEnabled,
      setVideoCurrentTimeOnMouseHover,
      annotationIntervalList,
      timeLimit,
      maxValue,
      showLegendForSingleSeries,
      onPointClick,
      formatter,
    ]
  );

  return <ReactApexChart options={options} series={series} type={"line"} height={height} />;
};
