import { ApexOptions } from "apexcharts";
import React, { useContext, useMemo } from "react";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { RangeAreaSeriesType } from "./types";
import { BaseChart } from "./Chart";

/**
 * @description
 * ChartRangeArea is a chart used to display the deviation range of a metric.
 * @param series is an array of objects where type 'line' comes first and type 'rangeArea' comes second.
 */
export const ChartRangeArea = ({
  title,
  series,
  height,
  colors,
  formatter,
}: {
  title: string;
  series: RangeAreaSeriesType;
  height: number;
  showLegendForSingleSeries?: boolean;
  colors: string[];
  formatter?: (label: string) => string;
}) => {
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    lastX: getLastX(series),
  });
  const videoEnabled = useContext(VideoEnabledContext);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "rangeArea",
        animations: {
          enabled: false,
          easing: undefined,
          dynamicAnimation: undefined,
        },
        events: videoEnabled ? setVideoCurrentTimeOnMouseHover : {},
      },
      stroke: {
        width: [...Array(series.length / 2).fill(2), ...Array(series.length / 2).fill(0)],
      },
      xaxis: {
        type: "category",
        min: 0,
        labels: {
          formatter: (label = "") => formatter?.(label) ?? label,
        },
      },
      yaxis: { min: 0 },
    }),
    [series.length, videoEnabled, setVideoCurrentTimeOnMouseHover, formatter]
  );

  return (
    <BaseChart
      type="rangeArea"
      title={title}
      series={series}
      height={height}
      colors={colors}
      options={options}
    />
  );
};
