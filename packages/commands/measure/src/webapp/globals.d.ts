import type { FlashlightData } from "../common/types";

declare global {
  interface Window {
    __FLASHLIGHT_DATA__: FlashlightData;
  }
}

export {};
