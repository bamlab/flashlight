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

type Props = {
  averagedResult: AveragedTestCaseResult;
};

export const ReportSummaryCard: FunctionComponent<Props> = ({
  averagedResult,
}) => {
  return (
    <div className="flex flex-col items-center py-6 px-10 bg-dark-charcoal border border-gray-800 rounded-lg w-[520px]">
      <div className="text-neutral-300 text-center">{averagedResult.name}</div>

      <div className="h-8" />

      <Score result={averagedResult} />

      <div className="h-8" />

      <ReportSummaryCardInfoRow
        title="Average Test Runtime"
        value={roundToDecimal(averagedResult.average.time, 0)}
        unit="ms"
      />
      <div className="h-2" />
      <ReportSummaryCardInfoRow
        title="Average FPS"
        value={roundToDecimal(
          getAverageFPSUsage(averagedResult.average.measures),
          1
        )}
        unit="FPS"
      />
      <div className="h-2" />
      <ReportSummaryCardInfoRow
        title="Average CPU usage"
        value={roundToDecimal(
          getAverageCpuUsage(averagedResult.average.measures),
          1
        )}
        unit="%"
      />
      <div className="h-2" />
      <ReportSummaryCardInfoRow
        title="High CPU Usage"
        value={roundToDecimal(
          getAverageTotalHighCPUUsage(averagedResult.averageHighCpuUsage) /
            1000,
          1
        )}
        unit="s"
      />
      <div className="h-2" />
      <ReportSummaryCardInfoRow
        title="Average RAM usage"
        value={roundToDecimal(
          getAverageRAMUsage(averagedResult.average.measures),
          1
        )}
        unit="MB"
      />
    </div>
  );
};
