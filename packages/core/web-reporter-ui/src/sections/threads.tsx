import React from "react";
import { AveragedTestCaseResult, TestCaseResult, ThreadNames } from "@perf-profiler/types";
import { RNLogo } from "../components/icons/ReactNativeLogo";
import { FlutterLogo } from "../components/icons/FlutterLogo";

export const getAutoSelectedThreads = (results: AveragedTestCaseResult[]) => {
  const autoSelectedThread = autoSelectedThreads.find((threadName) =>
    results
      .filter((result) => result.average.measures.length > 0)
      .every((result) => {
        const lastMeasure = result.average.measures[result.average.measures.length - 1];
        return (
          lastMeasure.cpu.perName[threadName] !== undefined ||
          // Support legacy json files with thread names in parenthesis
          lastMeasure.cpu.perName[`(${threadName})`] !== undefined
        );
      })
  );

  return autoSelectedThread ? [autoSelectedThread] : [];
};

const THREAD_NAME_MAPPING: {
  [key: string]: string;
} = {
  [ThreadNames.FLUTTER.UI]: "Flutter UI Thread",
  [ThreadNames.FLUTTER.RASTER]: "Flutter Raster Thread",
  [ThreadNames.FLUTTER.IO]: "Flutter IO Thread",
  [ThreadNames.RN.JS_ANDROID]: "RN JS Thread",
  [ThreadNames.RN.JS_BRIDGELESS_ANDROID]: "RN JS Thread",
  [ThreadNames.RN.JS_IOS]: "RN JS Thread",
  [ThreadNames.RN.OLD_BRIDGE]: "RN Bridge Thread",
};

export const THREAD_ICON_MAPPING = {
  [THREAD_NAME_MAPPING[ThreadNames.FLUTTER.UI]]: FlutterLogo,
  [THREAD_NAME_MAPPING[ThreadNames.FLUTTER.RASTER]]: FlutterLogo,
  [THREAD_NAME_MAPPING[ThreadNames.FLUTTER.IO]]: FlutterLogo,
  [THREAD_NAME_MAPPING[ThreadNames.RN.JS_ANDROID]]: RNLogo,
  [THREAD_NAME_MAPPING[ThreadNames.RN.JS_BRIDGELESS_ANDROID]]: RNLogo,
  [THREAD_NAME_MAPPING[ThreadNames.RN.JS_IOS]]: RNLogo,
  [THREAD_NAME_MAPPING[ThreadNames.RN.OLD_BRIDGE]]: RNLogo,
};

const autoSelectedThreads = [
  ThreadNames.RN.JS_IOS,
  ThreadNames.RN.JS_ANDROID,
  ThreadNames.RN.JS_BRIDGELESS_ANDROID,
  ThreadNames.FLUTTER.UI,
  ThreadNames.ANDROID.UI,
  ThreadNames.IOS.UI,
].map((threadName) => THREAD_NAME_MAPPING[threadName] || threadName);

export const getNumberOfThreads = (results: AveragedTestCaseResult[]) => {
  if (results.length === 0 || results[0].average.measures.length === 0) {
    return 0;
  }
  const lastMeasure = results[0].average.measures[results[0].average.measures.length - 1];
  return Object.keys(lastMeasure.cpu.perName).length;
};

export const mapThreadNames = (results: TestCaseResult[]): TestCaseResult[] =>
  results.map((result) => ({
    ...result,
    iterations: result.iterations.map((iteration) => ({
      ...iteration,
      measures: iteration.measures.map((measure) => ({
        ...measure,
        cpu: {
          ...measure.cpu,
          perName: Object.keys(measure.cpu.perName).reduce((acc, key) => {
            return { ...acc, [THREAD_NAME_MAPPING[key] || key]: measure.cpu.perName[key] };
          }, {}),
        },
      })),
    })),
  }));
