import React, { useEffect, useMemo, useRef } from "react";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import ApexCharts, { ApexAxisChartSeries, ApexOptions } from "apexcharts";
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
    } catch {
      // don't do anything
    }
  });
  seriesToShow.forEach((name) => {
    try {
      chart.showSeries(name);
    } catch {
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
  title: string | React.ReactNode;
  series: ApexAxisChartSeries;
  options?: ApexOptions;
  height: number;
  colors?: string[];
  visibleSeriesNames?: string[];
}) => {
  const commonOptions: ApexOptions = useMemo(
    () => ({
      chart: {
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
        toolbar: {
          show: false,
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
    [colors]
  );

  const chartOptions = useMemo(() => merge(commonOptions, options), [commonOptions, options]);

  // react-apexcharts fills this in on mount. Child effects run before ours, so it is
  // already set the first time the effect below runs.
  const chartRef = useRef<ApexCharts | null>(null);
  const seriesRef = useRef(series);

  // Kept in a ref so the visibility effect below can read the latest series without
  // re-running whenever they change. Written in an effect rather than during render, and
  // declared first so it lands before that effect reads it.
  useEffect(() => {
    seriesRef.current = series;
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    toggleSeriesVisibility(
      chart,
      seriesRef.current.map((serie) => serie.name).filter((name): name is string => !!name),
      visibleSeriesNames
    );
  }, [visibleSeriesNames]);

  return (
    <>
      <div className="mb-[5px] ml-[10px] text-2xl text-white flex flex-row font-medium">
        {title}
      </div>
      <ReactApexChart
        chartRef={chartRef}
        options={chartOptions}
        series={series}
        type={type}
        height={height}
      />
    </>
  );
};
