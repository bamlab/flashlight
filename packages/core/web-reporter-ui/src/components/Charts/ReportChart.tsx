import React, { useMemo, useContext } from "react";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { ApexOptions } from "apexcharts";
import { getColorPalette } from "../../theme/colors";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { AnnotationInterval, LineSeriesType } from "./types";
import { getAnnotations } from "./getAnnotations";
import { Chart } from "./Chart";

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
  title: string | React.ReactNode;
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
      annotations: getAnnotations(videoEnabled, annotationIntervalList) || {},
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
