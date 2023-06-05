import React, { FunctionComponent } from "react";
import { AveragedTestCaseResult } from "@perf-profiler/types";

type Props = {
  averagedResult: AveragedTestCaseResult;
};

export const FailedReportSummaryCard: FunctionComponent<Props> = ({
  averagedResult,
}) => {
  return (
    <div className="flex flex-col items-center py-6 px-10 bg-dark-charcoal border border-gray-800 rounded-lg w-[456px] flex-shrink-0">
      <div className="flex flex-row items-center gap-2">
        {/* With the line clamp for some reason, we need min-w as well when the name is big */}
        <div className="bg-theme-color rounded-full min-w-[12px] w-[12px] min-h-[12px]" />
        <div className="text-neutral-300 text-center line-clamp-1">
          {averagedResult.name}
        </div>
      </div>

      <div className="h-8" />

      <div className="text-6xl">❌</div>

      <div className="h-8" />
      <div className="text-neutral-300 text-center">
        {"The maximum number of retries has been exceeded for this test."}
      </div>

      <div className="h-8" />
      <div className="text-neutral-300 text-center">
        {"You are currently viewing the first failed iteration."}
      </div>
    </div>
  );
};
