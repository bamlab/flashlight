import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../server/socket/socketInterface";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  window.__FLASHLIGHT_DATA__.socketServerUrl
);

socket.on("disconnect", () => socket.close());
