import React, { useEffect, useMemo, useRef } from "react";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import ApexCharts, { ApexOptions } from "apexcharts";
import { POLLING_INTERVAL } from "@perf-profiler/types";
import { merge, partition } from "lodash";

function toggleSeriesVisibility(
  chart: ApexCharts,
  seriesNames: string[],
  visibleSeriesNames?: string[]
) {
  const [seriesToShow, seriesToHide] = partition(seriesNames, (name) => {
    if (!visibleSeriesNames) return true;
    return visibleSeriesNames.includes(name);
  });

  seriesToHide.forEach((name) => {
    try {
      chart.hideSeries(name);
    } catch (e) {
      // don't do anything
    }
  });
  seriesToShow.forEach((name) => {
    try {
      chart.showSeries(name);
    } catch (e) {
      // don't do anything
    }
  });
}

export const Chart = ({
  type,
  title,
  series,
  options = {},
  height,
  colors,
  visibleSeriesNames,
}: {
  type: Exclude<ApexChartProps["type"], undefined>;
  title: string;
  series: ApexAxisChartSeries;
  options?: ApexOptions;
  height: number;
  colors?: string[];
  visibleSeriesNames?: string[];
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

  const ref = useRef<ReactApexChart>(null);

  useEffect(() => {
    //@ts-expect-error chart is not defined in the typings, but it exists!
    const chart: ApexCharts | undefined = ref.current?.chart;
    if (!chart) return;

    toggleSeriesVisibility(
      chart,
      series.map((serie) => serie.name).filter((name): name is string => !!name),
      visibleSeriesNames
    );
  }, [series, visibleSeriesNames]);

  return (
    <ReactApexChart ref={ref} options={chartOptions} series={series} type={type} height={height} />
  );
};
