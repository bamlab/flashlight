import React from "react";
import { AveragedTestCaseResult, Measure } from "@perf-profiler/types";
import { getAverageCpuUsagePerProcess } from "@perf-profiler/reporter";
import { Paper, TableContainer } from "@mui/material";
import { keyBy, uniq } from "lodash";
import Table, { HeadCell } from "./Table";

const reportHeadCells: HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Thread",
  },
  {
    id: "averageCpuUsage",
    numeric: true,
    disablePadding: false,
    label: "Average CPU Usage (%)",
  },
  {
    id: "currentCpuUsage",
    numeric: true,
    disablePadding: false,
    label: "Current CPU Usage (%)",
  },
];

export const ComparativeThreadTable = ({
  results,
  selectedThreads,
  setSelectedThreads,
}: {
  results: AveragedTestCaseResult[];
  selectedThreads: string[];
  setSelectedThreads: (threads: string[]) => void;
}) => {
  const allMeasures = results.map((result) => {
    const measures = result.average.measures;
    // TODO: performance is probably not great here
    return keyBy(
      getAverageCpuUsagePerProcess(measures),
      (measure) => measure.processName
    );
  });

  const allThreadNames = uniq(
    allMeasures.reduce<string[]>(
      (threadNames, measures) => [...threadNames, ...Object.keys(measures)],
      []
    )
  );

  const rows = allThreadNames.map((threadName) => ({
    name: threadName,
    ...results.reduce(
      (threadMeasures, result, i) => ({
        ...threadMeasures,
        [`${result.name}-${i}`]: allMeasures[i]?.[threadName]?.cpuUsage || 0,
      }),
      {}
    ),
  }));

  const headCells: HeadCell[] = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Thread",
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...results.map((result, i) => ({
      id: `${result.name}-${i}`,
      label: result.name,
      numeric: true,
      disablePadding: false,
    })),
  ];

  return (
    <TableContainer component={Paper}>
      <Table
        headCells={headCells}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rows={rows}
        selected={selectedThreads}
        setSelected={setSelectedThreads}
      />
    </TableContainer>
  );
};

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
        headCells={reportHeadCells}
        rows={rows}
        selected={selectedThreads}
        setSelected={setSelectedThreads}
      />
    </TableContainer>
  );
};
