import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEvents,
} from "../server/socket/socketInterface";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  window.__FLASHLIGHT_DATA__.socketServerUrl
);

socket.on(SocketEvents.DISCONNECT, () => socket.close());
