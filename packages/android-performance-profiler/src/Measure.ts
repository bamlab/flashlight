import { CpuMeasure } from "./commands/cpu/CpuMeasure";

export interface Measure {
  cpu: CpuMeasure;
  ram: number;
}
