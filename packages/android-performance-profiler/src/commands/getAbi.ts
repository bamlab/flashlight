import { executeCommand } from "./shell";

export const getAbi = () =>
  executeCommand("adb shell getprop ro.product.cpu.abi").split("\n")[0];
