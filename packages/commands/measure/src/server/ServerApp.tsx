import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { open } from "@perf-profiler/shell";
import React, { useEffect, useState } from "react";
import { SocketType, SocketServer } from "./socket/socketInterface";
import { HostAndPortInfo } from "./components/HostAndPortInfo";
import { WEBAPP_URL, PORT } from "./constants";
import { ServerSocketConnectionApp } from "./ServerSocketConnectionApp";
import { useInput } from "ink";
import { cleanup } from "@perf-profiler/profiler";

const createExpressApp = () => {
  const app = express();
  app.use(cors({ origin: true }));
  // Serve the webapp folder built by parcel
  app.use(express.static(`${__dirname}/../../dist`));
  return app;
};

const allowOnlyOneSocketClient = (io: SocketServer, onConnect: (socket: SocketType) => void) => {
  let currentSocketClient: SocketType | null = null;

  io.on("connection", (socket) => {
    currentSocketClient?.disconnect(true);
    onConnect(socket);
    currentSocketClient = socket;
  });
};

const useCleanupOnManualExit = () => {
  useInput(async (input) => {
    switch (input) {
      case "q":
      case "c":
        cleanup();
        process.exit();
    }
  });
};

export const ServerApp = () => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  useEffect(() => {
    const app = createExpressApp();

    const server = http.createServer(app);
    const io: SocketServer = new Server(server, {
      cors: {
        origin: [WEBAPP_URL],
        methods: ["GET", "POST"],
      },
    });

    allowOnlyOneSocketClient(io, setSocket);

    server.listen(PORT, () => {
      open(WEBAPP_URL);
    });

    return () => {
      server.close();
      io.close();
    };
  }, []);
  useCleanupOnManualExit();

  return socket ? <ServerSocketConnectionApp socket={socket} /> : <HostAndPortInfo />;
};
