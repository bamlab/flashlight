/**
 * Chart.tsx reaches the ApexCharts instance through `ref.current.chart` so it can call
 * hideSeries/showSeries. That property only exists on the class implementation of
 * react-apexcharts (<= 1.4.x).
 *
 * 1.4.2 rewrote it with hooks in a patch release, so a React ref on it resolves to null and
 * the series-visibility toggles stop working - silently, because Chart.tsx bails out with
 * `if (!chart) return`. Nothing else catches this: jest-setup.ts mocks both react-apexcharts
 * and apexcharts globally, so the rendering path is never exercised.
 *
 * 1.4.2 through 1.5.x do not expose the instance at all. 1.6.0 reintroduced it as a `chartRef`
 * prop, but also raised the peer to apexcharts >= 4, which we are not on. So 1.4.1 is the only
 * version that works with apexcharts 3 and the code in Chart.tsx, hence the exact pin.
 *
 * The way out is the apexcharts 3 -> 4+ upgrade, migrating Chart.tsx to `chartRef` at the same
 * time. Until then this test is what stops the pin being bumped back.
 */
describe("react-apexcharts", () => {
  it("is a class component, so Chart.tsx can reach the instance through a ref", () => {
    const ReactApexChart = jest.requireActual("react-apexcharts").default;

    expect(typeof ReactApexChart.prototype?.render).toBe("function");
  });
});
