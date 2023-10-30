import React, { FunctionComponent } from "react";
import {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
  getAverageTotalHighCPUUsage,
} from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { roundToDecimal } from "../../../utils/roundToDecimal";
import { ReportSummaryCardInfoRow } from "./ReportSummaryCardInfoRow";
import { Score } from "../../components/Score";
import { Explanations } from "./Explanations";
import { Difference } from "./Difference";

type Props = {
  averagedResult: AveragedTestCaseResult;
  baselineResult?: AveragedTestCaseResult;
};

export const ReportSummaryCard: FunctionComponent<Props> = ({ averagedResult, baselineResult }) => {
  const displayPlaceholder = averagedResult.average.measures.length === 0;
  const averageTestRuntime = roundToDecimal(averagedResult.average.time, 0);
  const averageFPS = roundToDecimal(getAverageFPSUsage(averagedResult.average.measures), 1);
  const averageCPU = roundToDecimal(getAverageCpuUsage(averagedResult.average.measures), 1);
  const averageTotalHighCPU = roundToDecimal(
    getAverageTotalHighCPUUsage(averagedResult.averageHighCpuUsage) / 1000,
    1
  );
  const averageRAM = roundToDecimal(getAverageRAMUsage(averagedResult.average.measures), 1);
  return (
    <div className="flex flex-col items-center py-6 px-10 bg-dark-charcoal border border-gray-800 rounded-lg w-[500px] flex-shrink-0">
      <div className="flex flex-row items-center gap-2">
        {/* With the line clamp for some reason, we need min-w as well when the name is big */}
        <div className="bg-theme-color rounded-full min-w-[12px] w-[12px] min-h-[12px]" />
        <div className="text-neutral-300 text-center line-clamp-1">{averagedResult.name}</div>
      </div>

      <div className="h-8" />

      <Score result={averagedResult} />

      <div className="h-8" />

      <ReportSummaryCardInfoRow
        title="Average Test Runtime"
        value={displayPlaceholder ? "-" : `${averageTestRuntime} ms`}
        difference={
          <Difference value={averagedResult.average.time} baseline={baselineResult?.average.time} />
        }
        explanation={<Explanations.AverageTestRuntimeExplanation />}
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average FPS"
        value={displayPlaceholder ? "-" : `${averageFPS} FPS`}
        difference={
          <Difference
            value={getAverageFPSUsage(averagedResult.average.measures)}
            baseline={baselineResult && getAverageFPSUsage(baselineResult.average.measures)}
          />
        }
        explanation={<Explanations.AverageFPSExplanation />}
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average CPU usage"
        value={displayPlaceholder ? "-" : `${averageCPU} %`}
        difference={
          <Difference
            value={getAverageCpuUsage(averagedResult.average.measures)}
            baseline={baselineResult && getAverageCpuUsage(baselineResult.average.measures)}
          />
        }
        explanation={<Explanations.AverageCPUUsageExplanation />}
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="High CPU Usage"
        value={
          displayPlaceholder ? (
            "-"
          ) : (
            <div style={averageTotalHighCPU > 0 ? { color: "red" } : {}}>
              {averageTotalHighCPU > 0 ? `${averageTotalHighCPU} s` : "None ✅"}
            </div>
          )
        }
        difference={
          <Difference
            value={getAverageTotalHighCPUUsage(averagedResult.averageHighCpuUsage)}
            baseline={
              baselineResult && getAverageTotalHighCPUUsage(baselineResult.averageHighCpuUsage)
            }
          />
        }
        explanation={<Explanations.HighCPUUsageExplanation result={averagedResult} />}
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average RAM usage"
        value={displayPlaceholder ? "-" : `${averageRAM} MB`}
        difference={
          <Difference
            value={getAverageRAMUsage(averagedResult.average.measures)}
            baseline={baselineResult && getAverageRAMUsage(baselineResult.average.measures)}
          />
        }
        explanation={<Explanations.AverageRAMUsageExplanation />}
      />
    </div>
  );
};
