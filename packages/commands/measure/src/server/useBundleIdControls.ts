import { profiler } from "@perf-profiler/profiler";
import { useEffect } from "react";
import { SocketType, SocketData } from "./socket/socketInterface";

export const useBundleIdControls = (
  socket: SocketType,
  setState: (state: Partial<SocketData>) => void,
  stop: () => void
) => {
  useEffect(() => {
    socket.on("setBundleId", (bundleId) => {
      setState({
        bundleId,
      });
    });

    socket.on("autodetectBundleId", () => {
      stop();

      try {
        const bundleId = profiler.detectCurrentBundleId();
        setState({
          bundleId,
        });
      } catch (error) {
        socket.emit("sendError", error instanceof Error ? error.message : "unknown error");
      }
    });

    socket.on("autodetectRefreshRate", () => {
      stop();

      try {
        const refreshRate = profiler.detectDeviceRefreshRate();
        setState({
          refreshRate,
        });
      } catch (error) {
        socket.emit("sendError", error instanceof Error ? error.message : "unknown error");
      }
    });

    return () => {
      socket.removeAllListeners("setBundleId");
      socket.removeAllListeners("autodetectBundleId");
      socket.removeAllListeners("autodetectRefreshRate");
    };
  }, [setState, socket, stop]);
};
