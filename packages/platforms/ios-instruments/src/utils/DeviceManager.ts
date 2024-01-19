import { execSync } from "child_process";
import { Logger } from "@perf-profiler/logger";
import { writeTmpFile } from "./tmpFileManager";

export interface IdbDevice {
  name: string;
  udid: string;
  state: "Booted" | "Shutdown";
  deviceType: "simulator" | "device";
  iosVersion: string;
  architecture: string;
  companion: boolean;
}

type App = {
  name: string;
  bundleId: string;
  device: string;
  arch: string;
  state: string;
  debuggable: string;
  pid: string;
};

type RunningApp = {
  pid: number;
  bundleId: string;
};

let connectedDevice: IdbDevice | undefined;
let runningApp: RunningApp | undefined;

const idbGetRunningApp = (bundleId: string): App => {
  const app = execSync(`idb list-apps | grep ${bundleId}`).toString();
  const [name, bundleAppId, device, arch, state, debuggable, pid] = app
    .split("|")
    .map((s) => s.trim());
  return {
    name,
    bundleId: bundleAppId,
    device,
    arch,
    state,
    debuggable,
    pid: pid.split("=")[1] ?? pid === "None",
  };
};

const getRunningAppPid = (bundleId: string): number => {
  if (!runningApp) {
    throw new Error("No app running");
  }
  if (runningApp.bundleId !== bundleId) {
    throw new Error("App running is not the one we expected");
  }
  if (runningApp.pid) return runningApp.pid;
  const app = idbGetRunningApp(bundleId);
  if (app.pid === "None") {
    throw new Error("App is not running");
  }
  runningApp.pid = Number(app.pid);
  return runningApp.pid;
};

export const getConnectedDevice = (): IdbDevice | undefined => {
  if (!connectedDevice) {
    idbConnectToDevice();
  }
  return connectedDevice;
};

const adaptIdbDevice = (device: string): IdbDevice => {
  const [name, udid, state, deviceType, iosVersion, architecture, companion] = device.split("|");
  return {
    name: name.trim(),
    udid: udid.trim(),
    state: state.trim() as IdbDevice["state"],
    deviceType: deviceType.trim() as IdbDevice["deviceType"],
    iosVersion: iosVersion.trim(),
    architecture: architecture.trim(),
    companion: companion.trim() !== "No Companion Connected",
  };
};

export const idbConnectToDevice = () => {
  const allPossibleDevices = execSync("idb list-targets").toString();
  const bootedDevices = allPossibleDevices
    .split("\n")
    .filter((line) => line !== "")
    .map(adaptIdbDevice)
    .filter((device) => device.state === "Booted");
  if (bootedDevices.length === 0) {
    Logger.error("No booted devices found");
    process.exit(1);
  }
  if (bootedDevices.length > 1) {
    Logger.error("More than one booted device found");
    console.log(bootedDevices);
    process.exit(1);
  }
  execSync(`idb connect ${bootedDevices[0].udid}`);
  connectedDevice = bootedDevices[0];
};

export const launchApp = (bundleId: string): number => {
  const pid = JSON.parse(execSync(`idb launch ${bundleId}`).toString()).pid;
  runningApp = { pid, bundleId };
  return pid;
};

export const killApp = (bundleId: string, pid?: number) => {
  const connectedDevice = getConnectedDevice();
  if (!connectedDevice) {
    throw new Error("Device has been disconnected");
  }

  // for some reason I can't explain, idb is unable to stop the app so we have to do this
  if (connectedDevice.deviceType === "simulator") {
    const stopAppFile = writeTmpFile(
      "./stop.yaml",
      `appId: ${bundleId}
---
- stopApp
`
    );
    execSync(`maestro test ${stopAppFile} --no-ansi`, {
      stdio: "inherit",
    });
  } else {
    const runningAppPid = pid ?? getRunningAppPid(bundleId);
    execSync(`pyidevice kill ${runningAppPid}`);
  }
};
