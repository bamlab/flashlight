import { POLLING_INTERVAL, AveragedTestCaseResult } from "@perf-profiler/types";
import { roundToDecimal } from "@perf-profiler/reporter";
import React from "react";

type PropsType = {
  children: React.ReactNode;
};

export class HideSectionIfUndefinedValueFound extends React.Component<
  PropsType,
  {
    hasError: boolean;
  }
> {
  constructor(props: PropsType) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    if (!(error instanceof NoValueFound)) {
      throw error;
    }
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export class NoValueFound extends Error {}

export const buildValueGraph = <StatType extends "ram" | "fps">({
  results,
  stat,
}: {
  results: AveragedTestCaseResult[];
  stat: StatType;
}) =>
  results.map((result) => ({
    name: result.name,
    data: result.average.measures
      .map((measure) => {
        const value = measure[stat];
        if (value === undefined) {
          throw new NoValueFound();
        }
        return value;
      })
      .map((value, i) => ({
        x: i * POLLING_INTERVAL,
        y: roundToDecimal(value, 0),
      })),
  }));
