import { useRef, useMemo } from "react";
import { setVideoCurrentTime } from "../../../videoCurrentTimeContext";
import { RangeAreaSeriesType, LineSeriesType } from "./types";

export const getLastX = (series: RangeAreaSeriesType | LineSeriesType) => {
  if (series.length === 0) return undefined;
  const lastDataPoint = series[0].data.at(-1);
  return typeof lastDataPoint === "object" && lastDataPoint !== null && "x" in lastDataPoint
    ? lastDataPoint.x
    : undefined;
};

export const useSetVideoTimeOnMouseHover = ({
  lastX,
}: {
  lastX: number | string | undefined;
}): ApexChart["events"] => {
  const lastXRef = useRef(lastX);

  // Just making sure the useMemo doesn't depend on series since it doesn't need to
  lastXRef.current = lastX;

  return useMemo(
    () => ({
      mouseMove: (event, chart) => {
        if (lastXRef.current === undefined) return;

        const totalWidth = chart.events.ctx.dimensions.dimXAxis.w.globals.gridWidth;

        const mouseX =
          event.clientX - chart.el.getBoundingClientRect().left - chart.w.globals.translateX;

        const maxX = lastXRef.current;

        if (typeof maxX === "string") return;

        setVideoCurrentTime((mouseX / totalWidth) * maxX);

        // Manually translate via DOM to avoid re-rendering the chart
        const annotations = document.getElementsByClassName("apexcharts-xaxis-annotations");

        for (const annotation of annotations) {
          annotation.setAttribute("style", `transform: translateX(${mouseX}px);`);
        }
      },
    }),
    []
  );
};
