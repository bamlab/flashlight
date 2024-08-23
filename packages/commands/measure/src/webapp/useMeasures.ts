import { useEffect, useState } from "react";
import type { SocketData } from "../server/socket/socketInterface";
import { socket } from "./socket";

export const useMeasures = () => {
  const [state, setState] = useState<SocketData>();

  useEffect(() => {
    socket.on("updateState", setState);

    return () => {
      socket.off("updateState", setState);
    };
  }, []);

  return {
    bundleId: state?.bundleId ?? null,
    refreshRate: state?.refreshRate ?? 60,
    autodetect: () => {
      socket.emit("autodetectBundleId");
      socket.emit("autodetectRefreshRate");
    },
    setBundleId: (bundleId: string) => {
      socket.emit("setBundleId", bundleId);
      socket.emit("autodetectRefreshRate");
    },
    results: state?.results ?? [],
    isMeasuring: state?.isMeasuring ?? false,
    start: () => {
      socket.emit("start");
    },
    stop: () => {
      socket.emit("stop");
    },
    reset: () => {
      socket.emit("reset");
    },
  };
};
