import React, { useEffect, useRef } from "react";
import { render } from "@testing-library/react";
import { Chart } from "../src/components/Charts/Chart";
import { mockApexChartInstances } from "../mockApexChart";

const mockConstructedCharts: object[] = [];

// Overrides the global `{ exec }` mock from jest-setup.ts, so that the real react-apexcharts
// has something to construct below.
jest.mock("apexcharts", () => {
  return class FakeApexCharts {
    render = jest.fn();
    destroy = jest.fn();
    updateOptions = jest.fn();
    updateSeries = jest.fn();
    // react-apexcharts reads these back off the instance after constructing it.
    w = { config: { series: [] } };
    opts = { chart: { height: 100, width: "100%" } };

    constructor() {
      mockConstructedCharts.push(this);
    }
  };
});

/**
 * Chart.tsx reaches the ApexCharts instance to call hideSeries/showSeries. How you get hold of
 * that instance has already changed once without warning: 1.4.2 rewrote react-apexcharts with
 * hooks in a *patch* release, so the `ref.current.chart` the code used resolved to null and the
 * series toggles silently stopped working - Chart.tsx bails out with `if (!chart) return`, and
 * jest-setup.ts mocks both chart packages globally, so nothing failed.
 *
 * Since v2 the instance is exposed through the `chartRef` prop. These two tests pin both halves
 * of that contract: that react-apexcharts still fills `chartRef` in, and that Chart.tsx still
 * drives the chart through it.
 */
describe("react-apexcharts chartRef", () => {
  it("is filled in with the chart instance react-apexcharts constructs", () => {
    // Read past the global mock: this is the real library. It has shipped as both a bare
    // `module.exports` and an `__esModule` default over the versions we support.
    const actual = jest.requireActual("react-apexcharts");
    const ReactApexChart = actual.default ?? actual;
    let chartFromRef: unknown = null;

    const Probe = () => {
      const chartRef = useRef(null);
      useEffect(() => {
        chartFromRef = chartRef.current;
      });

      return (
        <ReactApexChart
          chartRef={chartRef}
          type="line"
          height={100}
          options={{}}
          series={[{ name: "a", data: [{ x: 1, y: 2 }] }]}
        />
      );
    };

    render(<Probe />);

    expect(mockConstructedCharts).toHaveLength(1);
    expect(chartFromRef).toBe(mockConstructedCharts[0]);
  });

  it("is what Chart.tsx toggles series visibility through", () => {
    mockApexChartInstances.length = 0;

    render(
      <Chart
        type="line"
        title="title"
        height={100}
        series={[
          { name: "shown", data: [{ x: 1, y: 2 }] },
          { name: "hidden", data: [{ x: 1, y: 2 }] },
        ]}
        visibleSeriesNames={["shown"]}
      />
    );

    const [chart] = mockApexChartInstances;

    expect(chart.showSeries.mock.calls).toEqual([["shown"]]);
    expect(chart.hideSeries.mock.calls).toEqual([["hidden"]]);
  });
});
