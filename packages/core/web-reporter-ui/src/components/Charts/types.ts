export type LineDataPointType = { x: number | string; y: number };

export type LinePlotType = { name: string; data: LineDataPointType[] };

export type LineSeriesType = LinePlotType[];

export type RangeAreaSeriesType = (
  | {
      type: string;
      name: string;
      data: {
        x: string;
        y: [number, number];
      }[];
    }
  | {
      type: string;
      name: string;
      data: {
        x: string;
        y: number | undefined;
      }[];
    }
)[];

export type AnnotationInterval = {
  y: number;
  y2: number;
  label: string;
  color: string;
};
