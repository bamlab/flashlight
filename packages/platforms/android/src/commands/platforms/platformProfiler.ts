import { AndroidProfiler } from "./AndroidProfiler";
import { UnixProfiler } from "./UnixProfiler";

export const profiler: UnixProfiler = new AndroidProfiler();
