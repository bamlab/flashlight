import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Logger } from "@perf-profiler/logger";
import { socket } from "../socket";
import { useLogSocketEvents } from "../../common/useLogSocketEvents";

const useSocketState = (onError: (error: string) => void) => {
  useLogSocketEvents(socket);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect(reason: string) {
      setIsConnected(false);

      Logger.info(`socket disconnected with reason: ${reason}`);

      if (reason === "transport close" || reason === "transport error") {
        onError("flashlight CLI command exited. Restart from the CLI.");
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sendError", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("sendError", onError);
    };
  }, [onError]);

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  return { isConnected };
};

export const SocketState = () => {
  const [error, setError] = React.useState<string | null>(null);
  const closeModal = () => setError(null);
  useSocketState(setError);

  const isModalOpened = error !== null;

  return (
    <>
      <Dialog
        open={isModalOpened}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">🚨 Woups, something happened</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
