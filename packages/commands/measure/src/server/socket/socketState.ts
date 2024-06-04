import { Measure, POLLING_INTERVAL, TestCaseIterationResult } from "@perf-profiler/types";
import { useState, useEffect } from "react";
import { SocketType, SocketData } from "./socketInterface";

export const useSocketState = (socket: SocketType) => {
  const [state, _setState] = useState<SocketData>({
    isMeasuring: false,
    bundleId: null,
    results: [],
  });

  const setState = (
    newState: Partial<SocketData> | ((previousState: SocketData) => SocketData)
  ) => {
    _setState(
      typeof newState === "function"
        ? newState
        : (previousState) => ({
            ...previousState,
            ...newState,
          })
    );
  };

  useEffect(() => {
    socket.emit("updateState", state);
  }, [state, socket]);

  return [state, setState] as const;
};

export const updateLastIterationReducer = (
  state: SocketData,
  iterationResult: TestCaseIterationResult
): SocketData => ({
  ...state,
  results: [
    ...state.results.slice(0, state.results.length - 1),
    {
      ...state.results[state.results.length - 1],
      iterations: [
        {
          ...iterationResult,
          time: (iterationResult.measures.length || 0) * POLLING_INTERVAL,
        },
      ],
    },
  ],
});

export const updateMeasuresReducer = (state: SocketData, measures: Measure[]): SocketData =>
  updateLastIterationReducer(state, {
    measures,
    time: (measures.length || 0) * POLLING_INTERVAL,
    status: "SUCCESS",
  });

export const addNewResultReducer = (state: SocketData, name: string): SocketData => ({
  ...state,
  results: [
    ...state.results,
    {
      name,
      iterations: [],
      status: "SUCCESS",
    },
  ],
});
