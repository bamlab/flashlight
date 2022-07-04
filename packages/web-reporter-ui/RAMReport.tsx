import React from "react";
import { Measure } from "android-performance-profiler";
import { Chart } from "./components/Chart";
import { useTheme } from "@mui/material/styles";
import { roundToDecimal } from "./utils/roundToDecimal";

export const RAMReport = ({ measures }: { measures: Measure[] }) => {
  const ram = [
    {
      name: "Total RAM Usage (MB)",
      data: measures
        .map((measure) => measure.ram)
        .map((value, i) => ({
          x: i * 500,
          y: roundToDecimal(value, 0),
        })),
    },
  ];

  const { palette } = useTheme();

  return (
    <>
      <Chart
        title="RAM Usage (MB)"
        height={500}
        interval={500}
        series={ram}
        colors={[palette.secondary.main]}
      />
    </>
  );
};
