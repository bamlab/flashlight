import { TestCaseResult } from "@perf-profiler/types";
import { Server, Socket } from "socket.io";

export interface SocketData {
  isMeasuring: boolean;
  bundleId: string | null;
  results: TestCaseResult[];
}

export interface ServerToClientEvents {
  updateState: (state: SocketData) => void;
  sendError(error: unknown): void;
}

export interface ClientToServerEvents {
  start: () => void;
  stop: () => void;
  reset: () => void;
  autodetectBundleId: () => void;
  setBundleId: (bundleId: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
