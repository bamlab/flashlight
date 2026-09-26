import { useEffect, useMemo, useRef } from "react";
import { ApexChart } from "apexcharts";
import { setVideoCurrentTime } from "../../../videoCurrentTimeContext";
import { RangeAreaSeriesType, LineSeriesType } from "./types";

export const getLastX = (series: RangeAreaSeriesType | LineSeriesType) => {
  if (series.length === 0) return undefined;
  const lastDataPoint = series[0].data.at(-1);
  return typeof lastDataPoint === "object" && lastDataPoint !== null && "x" in lastDataPoint
    ? lastDataPoint.x
    : undefined;
};

/**
 * The bits of apexcharts' internal state we read to map a mouse position onto the x axis.
 * Not part of the public typings: apexcharts spreads its state object into the third
 * argument of mouseMove, and the published type only describes it with an index signature.
 */
type ChartInternals = {
  globals?: { gridWidth?: number; translateX?: number };
  dom?: { baseEl?: Element };
};

export const useSetVideoTimeOnMouseHover = ({
  lastX,
}: {
  lastX: number | string | undefined;
}): ApexChart["events"] => {
  const lastXRef = useRef(lastX);

  // Just making sure the useMemo doesn't depend on series since it doesn't need to.
  // Written in an effect rather than during render: the handler only reads it on mousemove,
  // long after commit.
  useEffect(() => {
    lastXRef.current = lastX;
  });

  return useMemo(
    () => ({
      mouseMove: (event, _chart, options) => {
        const maxX = lastXRef.current;
        if (maxX === undefined || typeof maxX === "string") return;

        const { globals, dom } = (options ?? {}) as ChartInternals;
        const totalWidth = globals?.gridWidth;
        const chartElement = dom?.baseEl;
        if (!totalWidth || !chartElement) return;

        const mouseX =
          event.clientX - chartElement.getBoundingClientRect().left - (globals?.translateX ?? 0);

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
