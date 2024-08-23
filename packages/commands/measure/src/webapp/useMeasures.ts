import { useEffect, useState } from "react";
import { SocketData, SocketEvents } from "../server/socket/socketInterface";
import { socket } from "./socket";

export const useMeasures = () => {
  const [state, setState] = useState<SocketData>();

  useEffect(() => {
    socket.on(SocketEvents.UPDATE_STATE, setState);

    return () => {
      socket.off(SocketEvents.UPDATE_STATE, setState);
    };
  }, []);

  return {
    bundleId: state?.bundleId ?? null,
    refreshRate: state?.refreshRate ?? 60,
    autodetect: () => {
      socket.emit(SocketEvents.AUTODETECT_BUNDLE_ID);
      socket.emit(SocketEvents.AUTODETECT_REFRESH_RATE);
    },
    setBundleId: (bundleId: string) => {
      socket.emit(SocketEvents.SET_BUNDLE_ID, bundleId);
      socket.emit(SocketEvents.AUTODETECT_REFRESH_RATE);
    },
    results: state?.results ?? [],
    isMeasuring: state?.isMeasuring ?? false,
    start: () => {
      socket.emit(SocketEvents.START);
    },
    stop: () => {
      socket.emit(SocketEvents.STOP);
    },
    reset: () => {
      socket.emit(SocketEvents.RESET);
    },
  };
};
