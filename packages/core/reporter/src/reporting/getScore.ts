import { AveragedTestCaseResult, POLLING_INTERVAL } from "@perf-profiler/types";
import { round } from "lodash";
import { average } from "./averageIterations";
import { getAverageCpuUsage } from "./cpu";
import { getAverageFPSUsage } from "./fps";
import { canComputeHighCpuUsage } from "./highCpu";

/**
 * From https://www.mathcelebrity.com/3ptquad.php?p1=50%2C100&p2=200%2C50&p3=300%2C15&pl=Calculate+Equation
 * 50 -> 100
 * 200 -> 50
 * 300 -> 15
 */
const calculateCpuScore = (x: number) => Math.min(Math.max(0, -0.31666666666667 * x + 116), 100);

export const getScore = (result: AveragedTestCaseResult, refreshRate: number) => {
  const averageUIFPS = getAverageFPSUsage(result.average.measures);
  const averageCPUUsage = getAverageCpuUsage(result.average.measures);
  const totalTimeThreadlocked = Object.keys(result.averageHighCpuUsage).reduce(
    (sum, name) => sum + result.averageHighCpuUsage[name],
    0
  );

  const cpuScore = calculateCpuScore(averageCPUUsage);

  const scores = [cpuScore];

  if (averageUIFPS !== undefined) {
    const fpsScore = (averageUIFPS * 100) / refreshRate;
    scores.push(fpsScore);
  }

  const totalMeasureTime = result.average.measures.length * POLLING_INTERVAL;
  const timePercentageThreadlocked = canComputeHighCpuUsage(result)
    ? totalTimeThreadlocked / totalMeasureTime
    : 0;

  return round(Math.max(0, average(scores) * (1 - timePercentageThreadlocked)), 0);
};
