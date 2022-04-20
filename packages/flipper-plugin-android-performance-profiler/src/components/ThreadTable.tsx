import React from "react";
import { DevicePluginClient, createState } from "flipper-plugin";
import {
  Measure,
  getAverageCpuUsagePerProcess,
} from "android-performance-profiler";
import { Paper, TableContainer } from "@mui/material";
import { keyBy } from "lodash";
import Table from "./Table";

export const ThreadTable = ({
  measures,
  selectedThreads,
  setSelectedThreads,
}: {
  measures: Measure[];
  selectedThreads: string[];
  setSelectedThreads: (threads: string[]) => void;
}) => {
  // TODO: performance is probably not great here
  const averagePerProcess = getAverageCpuUsagePerProcess(measures);

  const currentMeasures = keyBy(
    getAverageCpuUsagePerProcess(measures.slice(-1)),
    (measure) => measure.processName
  );

  const rows = averagePerProcess.map((measure) => ({
    name: measure.processName,
    averageCpuUsage: measure.cpuUsage,
    currentCpuUsage: currentMeasures[measure.processName]?.cpuUsage || 0,
  }));

  return (
    <TableContainer component={Paper}>
      <Table
        rows={rows}
        selected={selectedThreads}
        setSelected={setSelectedThreads}
      />
    </TableContainer>
  );
};
