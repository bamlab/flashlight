import { Logger } from "@perf-profiler/logger";
import { useEffect } from "react";
import type { Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";

export const useLogSocketEvents = (socket: Socket | ClientSocket) => {
  useEffect(() => {
    function onAny(event: string, ...args: unknown[]) {
      Logger.debug(
        `Received socket event: ${event} with ${JSON.stringify(args)}`
      );
    }
    socket.onAny(onAny);

    return () => {
      socket.offAny(onAny);
    };
  }, [socket]);
};
