export const average = (arr: number[]) =>
  arr.reduce((p, c) => p + c, 0) / arr.length;
