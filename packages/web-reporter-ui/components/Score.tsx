import React from "react";
import { getScore } from "@perf-profiler/reporter";
import { AveragedTestCaseResult } from "@perf-profiler/types";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";

const getColor = (score: number) => {
  if (score >= 90) return "#2ECC40";
  if (score >= 50) return "#FF851B";
  return "#FF4136";
};

export const Score = ({ result }: { result: AveragedTestCaseResult }) => {
  const displayPlaceholder = result.average.measures.length === 0;
  const score = displayPlaceholder ? 100 : getScore(result);
  const color = displayPlaceholder ? "#eeeeee50" : getColor(score);

  return <CircularProgressWithLabel size={80} color={color} value={score} />;
};
