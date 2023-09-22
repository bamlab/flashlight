import { PerformanceMeasurer } from "@perf-profiler/e2e";
import { Logger } from "@perf-profiler/logger";
import { Measure } from "@perf-profiler/types";
import React, { useCallback, useEffect } from "react";
import { HostAndPortInfo } from "./components/HostAndPortInfo";
import { SocketType } from "./socket/socketInterface";
import { useSocketState, updateMeasuresReducer, addNewResultReducer } from "./socket/socketState";
import { useBundleIdControls } from "./useBundleIdControls";
import { useLogSocketEvents } from "../common/useLogSocketEvents";

export const ServerSocketConnectionApp = ({ socket }: { socket: SocketType }) => {
  useLogSocketEvents(socket);
  const [state, setState] = useSocketState(socket);
  const performanceMeasureRef = React.useRef<PerformanceMeasurer | null>(null);

  const stop = useCallback(async () => {
    performanceMeasureRef.current?.forceStop();
    setState({
      isMeasuring: false,
    });
  }, [setState]);

  useBundleIdControls(socket, setState, stop);

  useEffect(() => {
    const updateMeasures = (measures: Measure[]) =>
      setState((state) => updateMeasuresReducer(state, measures));
    const addNewResult = (bundleId: string) =>
      setState((state) => addNewResultReducer(state, bundleId));

    socket.on("start", async () => {
      setState({
        isMeasuring: true,
      });

      if (!state.bundleId) {
        Logger.error("No bundle id provided");
        return;
      }

      performanceMeasureRef.current = new PerformanceMeasurer(state.bundleId);

      addNewResult(state.bundleId);
      performanceMeasureRef.current?.start(() =>
        updateMeasures(performanceMeasureRef.current?.measures || [])
      );
    });

    socket.on("stop", stop);

    socket.on("reset", () => {
      stop();
      setState({
        results: [],
      });
    });

    return () => {
      socket.removeAllListeners("start");
      socket.removeAllListeners("stop");
      socket.removeAllListeners("reset");
    };
  }, [setState, socket, state.bundleId, stop]);

  return (
    <>
      <HostAndPortInfo />
    </>
  );
};
