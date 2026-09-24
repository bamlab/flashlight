import React from "react";
import { ApexOptions } from "apexcharts";

type MockChart = { hideSeries: jest.Mock; showSeries: jest.Mock };

/**
 * The chart instances the mock has handed to `chartRef`, oldest first. Use this to assert on
 * the imperative API (hideSeries / showSeries), which is otherwise invisible to the suite.
 */
export const mockApexChartInstances: MockChart[] = [];

// See https://github.com/apexcharts/react-apexcharts/issues/52
jest.mock("react-apexcharts", () => {
  // react-apexcharts is a function component since v2, and exposes the underlying ApexCharts
  // instance by filling in the `chartRef` prop on mount rather than through a forwarded ref.
  const ApexChart = ({
    series,
    options,
    chartRef,
  }: {
    options: ApexOptions;
    series: ApexOptions["series"];
    chartRef?: React.MutableRefObject<MockChart | null>;
  }) => {
    React.useEffect(() => {
      if (!chartRef) return;

      const chart: MockChart = { hideSeries: jest.fn(), showSeries: jest.fn() };
      mockApexChartInstances.push(chart);
      chartRef.current = chart;

      return () => {
        chartRef.current = null;
      };
    }, [chartRef]);

    return (
      <div className="ApexChartsMock">
        {JSON.stringify(options, null, 2)}
        {JSON.stringify(series, null, 2)}
      </div>
    );
  };

  return ApexChart;
});
jest.mock("apexcharts", () => ({ exec: jest.fn() }));
