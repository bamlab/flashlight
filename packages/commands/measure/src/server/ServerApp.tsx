import express from "express";
import http from "http";
import { promises as fs } from "fs";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import { open } from "@perf-profiler/shell";
import React, { useEffect, useState } from "react";
import { SocketType, SocketServer } from "./socket/socketInterface";
import { HostAndPortInfo } from "./components/HostAndPortInfo";
import { getWebAppUrl } from "./constants";
import { ServerSocketConnectionApp } from "./ServerSocketConnectionApp";
import { useInput } from "ink";
import { profiler } from "@perf-profiler/profiler";
import type { FlashlightData } from "../common/types";

const pathToDist = path.join(__dirname, "../../dist");

export const createExpressApp = (injected: FlashlightData) => {
  const app = express();
  app.use(cors({ origin: true }));

  app.get("/", async (_, res) => {
    try {
      const indexHtml = path.join(pathToDist, "index.html");
      let data = await fs.readFile(indexHtml, "utf8");
      data = data.replace(
        "/* %FLASHLIGHT_DATA% */",
        `window.__FLASHLIGHT_DATA__ = ${JSON.stringify(injected)};`
      );
      res.send(data);
    } catch (err) {
      res.status(500).send("Error loading the page");
    }
  });

  // Serve the webapp folder built by parcel
  app.use(express.static(pathToDist));
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
        profiler.cleanup();
        process.exit();
    }
  });
};

interface ServerAppProps {
  port: number;
}

export const ServerApp = ({ port }: ServerAppProps) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const webAppUrl = getWebAppUrl(port);
  useEffect(() => {
    const app = createExpressApp({ socketServerUrl: webAppUrl });

    const server = http.createServer(app);
    const io: SocketServer = new Server(server, {
      cors: {
        origin: [webAppUrl],
        methods: ["GET", "POST"],
      },
    });

    allowOnlyOneSocketClient(io, setSocket);

    server.listen(port, () => {
      open(webAppUrl);
    });

    return () => {
      server.close();
      io.close();
    };
  }, [port, webAppUrl]);
  useCleanupOnManualExit();

  return socket ? (
    <ServerSocketConnectionApp socket={socket} url={webAppUrl} />
  ) : (
    <HostAndPortInfo url={webAppUrl} />
  );
};
