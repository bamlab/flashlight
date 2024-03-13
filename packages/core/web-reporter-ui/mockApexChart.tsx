import React from "react";
import { ApexOptions } from "apexcharts";

// See https://github.com/apexcharts/react-apexcharts/issues/52
jest.mock("react-apexcharts", () => {
  const ApexChart = (
    {
      series,
      options,
    }: {
      options: ApexOptions;
      series: ApexOptions["series"];
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div className="ApexChartsMock" ref={ref}>
        {JSON.stringify(options, null, 2)}
        {JSON.stringify(series, null, 2)}
      </div>
    );
  };

  return React.forwardRef(ApexChart);
});
jest.mock("apexcharts", () => ({ exec: jest.fn() }));
