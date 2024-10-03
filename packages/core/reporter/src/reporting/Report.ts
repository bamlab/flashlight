import { TestCaseResult, AveragedTestCaseResult } from "@perf-profiler/types";
import { roundToDecimal } from "../utils/round";
import { averageTestCaseResult } from "./averageIterations";
import { getScore } from "./getScore";
import {
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getCpuStats,
  getThreadsStats,
} from "./cpu";
import { getAverageFPSUsage, getFpsStats } from "./fps";
import { getAverageTotalHighCPUUsage, getHighCpuStats } from "./highCpu";
import { getAverageRAMUsage, getRamStats } from "./ram";
import { getRuntimeStats } from "./runtime";

interface ReportMetrics {
  runtime: number;
  fps?: number;
  cpu: number;
  totalHighCpuTime: number;
  ram?: number;
  averageCpuUsagePerProcess: {
    cpuUsage: number;
    processName: string;
  }[];
}

export class Report {
  private result: TestCaseResult;
  private averagedResult: AveragedTestCaseResult;
  private averageMetrics: ReportMetrics;

  constructor(result: TestCaseResult) {
    this.result = Report.filterSuccessfulIterations(result);
    this.averagedResult = averageTestCaseResult(this.result);
    this.averageMetrics = Report.getAverageMetrics(this.averagedResult);
  }

  private static getAverageMetrics(averagedResult: AveragedTestCaseResult): ReportMetrics {
    const averageTestRuntime = roundToDecimal(averagedResult.average.time, 0);
    const averageFPS = getAverageFPSUsage(averagedResult.average.measures);
    const averageCPU = roundToDecimal(getAverageCpuUsage(averagedResult.average.measures), 1);
    const averageTotalHighCPU = roundToDecimal(
      getAverageTotalHighCPUUsage(averagedResult.averageHighCpuUsage) / 1000,
      1
    );
    const averageRAM = getAverageRAMUsage(averagedResult.average.measures);

    return {
      runtime: averageTestRuntime,
      fps: averageFPS ? roundToDecimal(averageFPS, 1) : undefined,
      cpu: averageCPU,
      totalHighCpuTime: averageTotalHighCPU,
      ram: averageRAM ? roundToDecimal(averageRAM, 1) : undefined,
      averageCpuUsagePerProcess: getAverageCpuUsagePerProcess(averagedResult.average.measures),
    };
  }

  private static filterSuccessfulIterations(result: TestCaseResult) {
    return {
      ...result,
      iterations:
        result.status === "SUCCESS"
          ? result.iterations.filter((iteration) => iteration.status === "SUCCESS")
          : result.iterations,
    };
  }

  public get name() {
    return this.result.name;
  }

  public get status() {
    return this.result.status;
  }

  public get score() {
    return this.averagedResult.score ?? getScore(this.averagedResult);
  }

  public getIterationCount() {
    return this.result.iterations.length;
  }

  public hasMeasures() {
    return this.result.iterations[0]?.measures.length > 0;
  }

  public hasVideos() {
    return !!this.result.iterations[0]?.videoInfos;
  }

  public selectIteration(iterationIndex: number): Report {
    return new Report({
      ...this.result,
      iterations: [this.result.iterations[iterationIndex]],
    });
  }

  public getAveragedResult() {
    return this.averagedResult;
  }

  public getAverageMetrics() {
    return this.averageMetrics;
  }

  public getStats() {
    const iterations = this.result.iterations;

    return {
      cpu: getCpuStats(iterations, this.averageMetrics.cpu),
      fps: getFpsStats(iterations, this.averageMetrics.fps),
      highCpu: getHighCpuStats(iterations, this.averagedResult.averageHighCpuUsage),
      ram: getRamStats(iterations, this.averageMetrics.ram),
      runtime: getRuntimeStats(iterations, this.averageMetrics.runtime),
      threads: getThreadsStats(iterations),
    };
  }

  public getRefreshRate() {
    return this.result.specs?.refreshRate ?? 60;
  }
}
