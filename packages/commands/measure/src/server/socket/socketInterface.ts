import { TestCaseResult } from "@perf-profiler/types";
import { Server, Socket } from "socket.io";

export interface SocketData {
  isMeasuring: boolean;
  bundleId: string | null;
  results: TestCaseResult[];
  refreshRate: number;
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
  autodetectRefreshRate: () => void;
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

export enum SocketEvents {
  START = "start",
  STOP = "stop",
  RESET = "reset",
  AUTODETECT_BUNDLE_ID = "autodetectBundleId",
  SET_BUNDLE_ID = "setBundleId",
  AUTODETECT_REFRESH_RATE = "autodetectRefreshRate",
  UPDATE_STATE = "updateState",
  SEND_ERROR = "sendError",
  PING = "ping",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}
