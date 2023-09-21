import { executeCommand } from "./shell";

export const getAbi = () =>
  executeCommand("adb shell getprop ro.product.cpu.abi").split(/\r\n|\n|\r/)[0];
