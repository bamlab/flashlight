import { PerformanceMeasurer } from "@perf-profiler/e2e";
import { Logger } from "@perf-profiler/logger";
import { Measure } from "@perf-profiler/types";
import React, { useCallback, useEffect } from "react";
import { HostAndPortInfo } from "./components/HostAndPortInfo";
import { SocketType, SocketEvents } from "./socket/socketInterface";
import { useSocketState, updateMeasuresReducer, addNewResultReducer } from "./socket/socketState";
import { useBundleIdControls } from "./useBundleIdControls";
import { useLogSocketEvents } from "../common/useLogSocketEvents";

export const ServerSocketConnectionApp = ({ socket, url }: { socket: SocketType; url: string }) => {
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
      setState((state) =>
        addNewResultReducer(
          state,
          `${bundleId}${state.results.length > 0 ? ` (${state.results.length + 1})` : ""}`
        )
      );

    socket.on(SocketEvents.START, async () => {
      setState({
        isMeasuring: true,
      });

      if (!state.bundleId) {
        Logger.error("No bundle id provided");
        return;
      }

      performanceMeasureRef.current = new PerformanceMeasurer(state.bundleId, {
        recordOptions: {
          record: false,
        },
      });

      addNewResult(state.bundleId);
      performanceMeasureRef.current?.start(() =>
        updateMeasures(performanceMeasureRef.current?.measures || [])
      );
    });

    socket.on(SocketEvents.STOP, stop);

    socket.on(SocketEvents.RESET, () => {
      stop();
      setState({
        results: [],
      });
    });

    return () => {
      socket.removeAllListeners(SocketEvents.START);
      socket.removeAllListeners(SocketEvents.STOP);
      socket.removeAllListeners(SocketEvents.RESET);
    };
  }, [setState, socket, state.bundleId, stop]);

  return (
    <>
      <HostAndPortInfo url={url} />
    </>
  );
};
