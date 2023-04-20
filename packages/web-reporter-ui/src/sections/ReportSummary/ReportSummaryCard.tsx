import React, { FunctionComponent } from "react";
import {
  sanitizeProcessName,
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
  getAverageTotalHighCPUUsage,
} from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { roundToDecimal } from "../../../utils/roundToDecimal";
import { ReportSummaryCardInfoRow } from "./ReportSummaryCardInfoRow";
import { Score } from "../../components/Score";
import { orderBy } from "lodash";

type Props = {
  averagedResult: AveragedTestCaseResult;
};

export const ReportSummaryCard: FunctionComponent<Props> = ({
  averagedResult,
}) => {
  const averageTestRuntime = roundToDecimal(averagedResult.average.time, 0);
  const averageFPS = roundToDecimal(
    getAverageFPSUsage(averagedResult.average.measures),
    1
  );
  const averageCPU = roundToDecimal(
    getAverageCpuUsage(averagedResult.average.measures),
    1
  );
  const averageTotalHighCPU = roundToDecimal(
    getAverageTotalHighCPUUsage(averagedResult.averageHighCpuUsage) / 1000,
    1
  );
  const averageRAM = roundToDecimal(
    getAverageRAMUsage(averagedResult.average.measures),
    1
  );
  return (
    <div className="flex flex-col items-center py-6 px-10 bg-dark-charcoal border border-gray-800 rounded-lg w-[520px] flex-shrink-0">
      <div className="text-neutral-300 text-center">{averagedResult.name}</div>

      <div className="h-8" />

      <Score result={averagedResult} />

      <div className="h-8" />

      <ReportSummaryCardInfoRow
        title="Average Test Runtime"
        value={`${averageTestRuntime} ms`}
        explanation={
          <>
            Time taken to run the test.
            <br />
            Can be helpful to measure Time To Interactive of your app, if the
            test is checking app start for instance.
          </>
        }
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average FPS"
        value={`${averageFPS} FPS`}
        explanation={
          <>
            Frame Per Second. Your app should display 60 Frames Per Second to
            give an impression of fluidity. This number should be close to 60,
            otherwise it will seem laggy. <br />
            See{" "}
            <a
              href="https://www.youtube.com/watch?v=CaMTIgxCSqU"
              target="_blank"
              rel="noreferrer"
            >
              this video
            </a>{" "}
            for more details
          </>
        }
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average CPU usage"
        value={`${averageCPU} %`}
        explanation={
          <>
            An app might run at 60FPS but might be using too much processing
            power, so it's important to check CPU usage.
            <br /> Depending on the device, this value can go up to{" "}
            <code>100% x number of cores</code>. For instance, a Samsung A10s
            has 4 cores, so the max value would be 400%.
          </>
        }
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="High CPU Usage"
        value={
          <div style={averageTotalHighCPU > 0 ? { color: "red" } : {}}>
            {averageTotalHighCPU > 0 ? `${averageTotalHighCPU} s` : "None ✅"}
          </div>
        }
        explanation={
          <div className="flex flex-row">
            <div>
              High CPU usage by a single process can cause app unresponsiveness,
              even with low overall CPU usage. For instance, an overworked JS
              thread in a React Native app may lead to unresponsiveness despite
              maintaining 60 FPS.
            </div>
            <div className="whitespace-pre pl-1">
              {orderBy(
                Object.keys(averagedResult.averageHighCpuUsage),
                (processName) =>
                  averagedResult.averageHighCpuUsage[processName],
                "desc"
              ).map((processName) => (
                <div key={processName}>
                  {sanitizeProcessName(processName)} for{" "}
                  {roundToDecimal(
                    averagedResult.averageHighCpuUsage[processName] / 1000,
                    1
                  )}
                  s
                </div>
              ))}
            </div>
          </div>
        }
      />
      <div className="h-2" />

      <ReportSummaryCardInfoRow
        title="Average RAM usage"
        value={`${averageRAM} MB`}
        explanation={
          <>
            If an app consumes a large amount of RAM (random-access memory), it
            can impact the overall performance of the device and drain the
            battery more quickly.
            <br />
            It’s worth noting that results might be higher than expected since
            we measure RSS and not PSS (See{" "}
            <a
              href="https://github.com/bamlab/android-performance-profiler/issues/11#issuecomment-1219317891"
              target="_blank"
              rel="noreferrer"
            >
              here for more details
            </a>
            )
          </>
        }
      />
    </div>
  );
};
