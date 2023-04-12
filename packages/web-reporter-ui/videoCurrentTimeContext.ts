import { atom, useAtomValue, useSetAtom } from "jotai";

const videoCurrentTimeAtom = atom(0);

export const useVideoCurrentTime = () => useAtomValue(videoCurrentTimeAtom);
export const useSetVideoCurrentTime = () => useSetAtom(videoCurrentTimeAtom);
