import React, { ComponentProps } from "react";
import { Measure } from "android-performance-profiler";
import { Chart } from "./components/Chart";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { roundToDecimal } from "./utils/roundToDecimal";

const SectionTitle = (props: ComponentProps<typeof Typography>) => (
  <Typography
    variant="h4"
    {...props}
    style={{ color: "#666666", margin: 10 }}
  ></Typography>
);

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
      <SectionTitle>RAM</SectionTitle>
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
