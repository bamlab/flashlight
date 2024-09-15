import orderBy from "lodash/orderBy";
import React from "react";
import { roundToDecimal, sanitizeProcessName } from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";

const AverageTestRuntimeExplanation = () => (
  <>
    Time taken to run the test.
    <br />
    Can be helpful to measure Time To Interactive of your app, if the test is checking app start for
    instance.
  </>
);

const AverageFPSExplanation = ({ refreshRate }: { refreshRate: number }) => (
  <>
    {`Frame Per Second. Your app should display ${refreshRate} Frames Per Second to give an impression of fluidity. This number should be close to ${refreshRate}, otherwise it will seem laggy.`}{" "}
    <br />
    See{" "}
    <a href="https://www.youtube.com/watch?v=CaMTIgxCSqU" target="_blank" rel="noreferrer">
      this video
    </a>{" "}
    for more details
  </>
);

const AverageCPUUsageExplanation = () => (
  <>
    An app might run at high frame rates, such as 60 FPS or higher, but might be using too much
    processing power, so it&apos;s important to check CPU usage.
    <br /> Depending on the device, this value can go up to <code>100% x number of cores</code>. For
    instance, a Samsung A10s has 4 cores, so the max value would be 400%.
  </>
);

const AverageRAMUsageExplanation = () => (
  <>
    If an app consumes a large amount of RAM (random-access memory), it can impact the overall
    performance of the device and drain the battery more quickly.
    <br />
    It’s worth noting that results might be higher than expected since we measure RSS and not PSS
    (See{" "}
    <a
      href="https://github.com/bamlab/android-performance-profiler/issues/11#issuecomment-1219317891"
      target="_blank"
      rel="noreferrer"
    >
      here for more details
    </a>
    )
  </>
);

const HighCPUUsageExplanation = ({
  result,
  refreshRate,
}: {
  result: AveragedTestCaseResult;
  refreshRate: number;
}) => (
  <>
    <div className="mb-2">
      <p>Impacted threads:</p>
      {orderBy(
        Object.keys(result.averageHighCpuUsage),
        (processName) => result.averageHighCpuUsage[processName],
        "desc"
      ).map((processName) => (
        <p key={processName} className="whitespace-pre">
          - {sanitizeProcessName(processName)} for{" "}
          {roundToDecimal(result.averageHighCpuUsage[processName] / 1000, 1)}s
        </p>
      ))}
    </div>
    {`High CPU usage by a single process can cause app unresponsiveness, even with low overall CPU usage. For instance, an overworked JS thread in a React Native app may lead to unresponsiveness despite maintaining ${refreshRate} FPS.`}
  </>
);

export const Explanations = {
  AverageTestRuntimeExplanation,
  AverageFPSExplanation,
  AverageCPUUsageExplanation,
  AverageRAMUsageExplanation,
  HighCPUUsageExplanation,
};
