import React, { FunctionComponent } from "react";
import { Report, canComputeHighCpuUsage } from "@perf-profiler/reporter";
import { DeviceSpecs } from "@perf-profiler/types";
import { ReportSummaryCardInfoRow } from "./ReportSummaryCardInfoRow";
import { Score } from "../../components/Score";
import { Explanations } from "./Explanations";
import { Difference, isDifferencePositive } from "./Difference";
import { SummaryStats } from "./SummaryStats";
import { ThreadStats } from "./ThreadStats";

type Props = {
  report: Report;
  baselineReport?: Report;
  deviceSpecs: DeviceSpecs;
};

export const ReportSummaryCard: FunctionComponent<Props> = ({
  report,
  baselineReport,
  deviceSpecs,
}) => {
  const displayPlaceholder = !report.hasMeasures();
  const metrics = report.getAverageMetrics();
  const baselineMetrics = baselineReport?.getAverageMetrics();

  const shouldDisplayStats = report.getIterationCount() > 1;
  const reportStats = shouldDisplayStats ? report.getStats() : undefined;

  const averagedTestCaseResult = report.getAveragedResult();

  return (
    <div className="flex flex-col items-center py-6 px-10 bg-dark-charcoal border border-gray-800 rounded-lg w-[500px] flex-shrink-0">
      <div className="flex flex-row items-center gap-2">
        {/* With the line clamp for some reason, we need min-w as well when the name is big */}
        <div className="bg-theme-color rounded-full min-w-[12px] w-[12px] min-h-[12px]" />
        <div className="text-neutral-300 text-center line-clamp-1">{report.name}</div>
      </div>

      <div className="h-8" />

      <Score report={report} />

      <div className="h-8" />

      <ReportSummaryCardInfoRow
        title="Average Test Runtime"
        value={displayPlaceholder ? "-" : `${metrics.runtime} ms`}
        difference={<Difference value={metrics.runtime} baseline={baselineMetrics?.runtime} />}
        explanation={<Explanations.AverageTestRuntimeExplanation />}
        statistics={
          reportStats ? <SummaryStats stats={reportStats.runtime} unit="ms" /> : undefined
        }
      />

      {metrics.fps !== undefined || displayPlaceholder ? (
        <>
          <div className="h-2" />
          <ReportSummaryCardInfoRow
            title="Average FPS"
            value={displayPlaceholder ? "-" : `${metrics.fps} FPS`}
            difference={
              <Difference
                value={metrics.fps}
                baseline={baselineMetrics?.fps}
                hasValueImproved={isDifferencePositive}
              />
            }
            explanation={
              <Explanations.AverageFPSExplanation refreshRate={deviceSpecs.refreshRate} />
            }
            statistics={
              reportStats?.fps ? <SummaryStats stats={reportStats.fps} unit="FPS" /> : undefined
            }
          />
        </>
      ) : null}

      <div className="h-2" />
      <ReportSummaryCardInfoRow
        title="Average CPU usage"
        value={displayPlaceholder ? "-" : `${metrics.cpu} %`}
        difference={<Difference value={metrics.cpu} baseline={baselineMetrics?.cpu} />}
        statistics={reportStats ? <SummaryStats stats={reportStats.cpu} unit="%" /> : undefined}
        explanation={<Explanations.AverageCPUUsageExplanation />}
      />

      <div className="h-2" />
      {canComputeHighCpuUsage(averagedTestCaseResult) && (
        <ReportSummaryCardInfoRow
          title="High CPU Usage"
          value={
            displayPlaceholder ? (
              "-"
            ) : (
              <div style={metrics.totalHighCpuTime > 0 ? { color: "red" } : {}}>
                {metrics.totalHighCpuTime > 0 ? `${metrics.totalHighCpuTime} s` : "None ✅"}
              </div>
            )
          }
          difference={
            <Difference
              value={metrics.totalHighCpuTime}
              baseline={baselineMetrics?.totalHighCpuTime}
            />
          }
          explanation={<Explanations.HighCPUUsageExplanation result={averagedTestCaseResult} />}
          statistics={
            reportStats ? (
              <>
                <SummaryStats stats={reportStats.highCpu} unit="ms" />{" "}
                <ThreadStats stats={reportStats.highCpu.threads} />
              </>
            ) : undefined
          }
        />
      )}

      {metrics.ram !== undefined || displayPlaceholder ? (
        <>
          <div className="h-2" />
          <ReportSummaryCardInfoRow
            title="Average RAM usage"
            value={displayPlaceholder ? "-" : `${metrics.ram} MB`}
            difference={<Difference value={metrics.ram} baseline={baselineMetrics?.ram} />}
            explanation={<Explanations.AverageRAMUsageExplanation />}
            statistics={
              reportStats?.ram ? <SummaryStats stats={reportStats.ram} unit="MB" /> : undefined
            }
          />
        </>
      ) : null}
    </div>
  );
};
