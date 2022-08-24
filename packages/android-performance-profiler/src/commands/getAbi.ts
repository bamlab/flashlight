import { executeCommand } from "./shellNext";

export const getAbi = () =>
  executeCommand("adb shell getprop ro.product.cpu.abi").split("\n")[0];
