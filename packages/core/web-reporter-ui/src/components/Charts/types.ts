export type LineSeriesType = { name: string; data: { x: number | string; y: number }[] }[];

export type RangeAreaSeriesType = (
  | {
      type: string;
      name: string;
      data: {
        x: string;
        y: [number, number] | undefined;
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
