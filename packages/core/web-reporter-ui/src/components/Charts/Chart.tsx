import React, { useMemo, useContext } from "react";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../../theme/colors";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { AnnotationInterval, LineSeriesType } from "./types";
import { getAnnotations } from "./getAnnotations";
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

export const ReportChart = ({
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

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        events: videoEnabled ? setVideoCurrentTimeOnMouseHover : {},
      },
      annotations: getAnnotations(annotationIntervalList) || {},
      stroke: {
        width: 2,
      },
      xaxis: {
        type: "numeric",
        max: timeLimit || undefined,
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
      videoEnabled,
      setVideoCurrentTimeOnMouseHover,
      annotationIntervalList,
      timeLimit,
      maxValue,
      showLegendForSingleSeries,
    ]
  );

  return (
    <Chart
      type="line"
      title={title}
      series={series}
      colors={colors}
      height={height}
      options={options}
    />
  );
};
