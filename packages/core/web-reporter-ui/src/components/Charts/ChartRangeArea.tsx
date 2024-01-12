import { ApexOptions } from "apexcharts";
import React, { useContext, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { VideoEnabledContext } from "../../../videoCurrentTimeContext";
import { getLastX, useSetVideoTimeOnMouseHover } from "./useSetVideoTimeOnMouseHover";
import { RangeAreaSeriesType } from "./types";

const labels = { style: { colors: "#FFFFFF99" } };

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
}: {
  title: string;
  series: RangeAreaSeriesType;
  height: number;
  showLegendForSingleSeries?: boolean;
  colors: string[];
}) => {
  const setVideoCurrentTimeOnMouseHover = useSetVideoTimeOnMouseHover({
    lastX: getLastX(series),
  });
  const videoEnabled = useContext(VideoEnabledContext);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        id: title,
        type: "rangeArea",
        animations: {
          enabled: false,
        },
        events: videoEnabled ? setVideoCurrentTimeOnMouseHover : {},
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
        width: [...Array(series.length / 2).fill(2), ...Array(series.length / 2).fill(0)],
      },
      xaxis: {
        type: "numeric",
        min: 0,
        labels,
      },
      yaxis: { min: 0, labels },
      colors,
      legend: {
        labels: labels.style,
      },
      grid: {
        borderColor: "#FFFFFF33",
        strokeDashArray: 3,
      },
    }),
    [title, series.length, colors, videoEnabled, setVideoCurrentTimeOnMouseHover]
  );

  return <ReactApexChart options={options} series={series} type={"rangeArea"} height={height} />;
};
