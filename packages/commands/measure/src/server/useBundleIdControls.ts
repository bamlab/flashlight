import { profiler } from "@perf-profiler/profiler";
import { useEffect } from "react";
import { SocketType, SocketData, SocketEvents } from "./socket/socketInterface";

export const useBundleIdControls = (
  socket: SocketType,
  setState: (state: Partial<SocketData>) => void,
  stop: () => void
) => {
  useEffect(() => {
    socket.on(SocketEvents.SET_BUNDLE_ID, (bundleId) => {
      const refreshRate = profiler.detectDeviceRefreshRate();
      setState({
        bundleId,
        refreshRate,
      });
    });

    socket.on(SocketEvents.AUTODETECT_BUNDLE_ID, () => {
      stop();

      try {
        const bundleId = profiler.detectCurrentBundleId();
        setState({
          bundleId,
        });
      } catch (error) {
        socket.emit(
          SocketEvents.SEND_ERROR,
          error instanceof Error ? error.message : "unknown error"
        );
      }
    });

    socket.on(SocketEvents.AUTODETECT_REFRESH_RATE, () => {
      stop();

      const refreshRate = profiler.detectDeviceRefreshRate();
      setState({
        refreshRate,
      });
    });

    return () => {
      socket.removeAllListeners(SocketEvents.SET_BUNDLE_ID);
      socket.removeAllListeners(SocketEvents.AUTODETECT_BUNDLE_ID);
      socket.removeAllListeners(SocketEvents.AUTODETECT_REFRESH_RATE);
    };
  }, [setState, socket, stop]);
};
