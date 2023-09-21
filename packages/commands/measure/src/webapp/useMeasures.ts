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
    autodetect: () => {
      socket.emit("autodetectBundleId");
    },
    setBundleId: (bundleId: string) => {
      socket.emit("setBundleId", bundleId);
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
