export interface CpuMeasure {
  perName: { [processName: string]: number };
  perCore: { [core: number]: number };
}
