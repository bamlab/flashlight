import React from "react";
import { TinyEmitter } from "tiny-emitter";

const emitter = new TinyEmitter();

const SET_VIDEO_CURRENT_TIME = "SET_VIDEO_CURRENT_TIME";
export const setVideoCurrentTime = (time: number) => {
  emitter.emit(SET_VIDEO_CURRENT_TIME, time);
};

export const useListenToVideoCurrentTime = (callback: (time: number) => void) => {
  React.useEffect(() => {
    emitter.on(SET_VIDEO_CURRENT_TIME, callback);
    return () => {
      emitter.off(SET_VIDEO_CURRENT_TIME, callback);
    };
  }, [callback]);
};

export const VideoEnabledContext = React.createContext(false);
