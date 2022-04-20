export interface Measure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}
