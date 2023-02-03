import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import Table from "ink-table";
import { Measure } from "@perf-profiler/profiler";
import {
  getAverageCpuUsage,
  sanitizeProcessName,
} from "@perf-profiler/reporter";
import { Logger } from "@perf-profiler/logger";
import { PerformanceMeasurer } from "../../PerformanceMeasurer";

const MeasureSummary = ({ measure }: { measure: Measure }) => {
  return (
    <Table
      data={[
        {
          FPS: measure.fps.toFixed(1),
          "Total CPU Usage (%)": getAverageCpuUsage([measure]).toFixed(1),
          "RAM (MB)": measure.ram.toFixed(1),
        },
      ]}
    />
  );
};

const ThreadTable = ({ measure }: { measure: Measure }) => {
  return (
    <Table
      padding={0}
      data={Object.entries(measure.cpu.perName)
        .sort(([, aCpuUsage], [, bCpuUsage]) => bCpuUsage - aCpuUsage)
        .map(([name, value]) => ({
          "Thread name": sanitizeProcessName(name),
          "CPU Usage (%)": value.toFixed(1),
        }))}
    />
  );
};

const TextExplanation = () => (
  <>
    <Box>
      <Text bold>
        Press <Text color="green">w</Text> to write measures
      </Text>
    </Box>
    <Box>
      <Text>
        Press <Text color="blue">t</Text> to show/hide threads
      </Text>
    </Box>
  </>
);

export const MeasureCommandUI = ({
  performanceMeasurer,
  writeReportFile,
}: {
  performanceMeasurer: PerformanceMeasurer;
  writeReportFile: () => Promise<void>;
}) => {
  const [currentMeasure, setCurrentMeasure] = useState<Measure | null>(null);
  const [showUI, setShowUI] = useState(true);
  const [showThreads, setShowThreads] = useState(false);

  useInput(async (input) => {
    switch (input) {
      case "t":
        setShowThreads(!showThreads);
        return;
      case "w":
        setShowUI(false);
        Logger.info("Writing report...");
        await writeReportFile();
        process.exit();
    }
  });

  useEffect(() => {
    performanceMeasurer.start(setCurrentMeasure);

    return () => {
      performanceMeasurer.stop();
      process.exit();
    };
  }, [performanceMeasurer]);

  if (!showUI) {
    return null;
  }

  return currentMeasure ? (
    <>
      <Box height={1} />
      <MeasureSummary measure={currentMeasure} />
      {showThreads && <ThreadTable measure={currentMeasure} />}
      <Box height={1} />
      <TextExplanation />
    </>
  ) : (
    <Text>Waiting for first measure...</Text>
  );
};
