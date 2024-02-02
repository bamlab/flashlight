import { Measure, Profiler, ProfilerPollingOptions, ScreenRecorder } from "@perf-profiler/types";
import { ChildProcess } from "child_process";
// TODO: refactor so that these functions are not in android
// eslint-disable-next-line import/no-extraneous-dependencies
import { executeAsync, executeCommand } from "@perf-profiler/android";
import { IdbDevice, getConnectedDevice, killApp, launchApp } from "./utils/DeviceManager";
import { computeMeasures } from "./XcodePerfParser";
import { getTmpFilePath, removeTmpFiles } from "./utils/tmpFileManager";
export { killApp } from "./utils/DeviceManager";

const startRecord = async (
  deviceUdid: string,
  appPid: number,
  traceFile: string
): Promise<ChildProcess> => {
  const templateFilePath = `${__dirname}/../Flashlight.tracetemplate`;
  const recordingProcess = executeAsync(
    `xcrun xctrace record --device ${deviceUdid} --template ${templateFilePath} --attach ${appPid} --output ${traceFile}`
  );
  await new Promise<void>((resolve) => {
    recordingProcess.stdout?.on("data", (data) => {
      if (data.toString().includes("Ctrl-C to stop")) {
        resolve();
      }
    });
  });
  return recordingProcess;
};

const saveTraceFile = (traceFile: string): string => {
  const xmlOutputFile = getTmpFilePath("report.xml");
  executeCommand(
    `xctrace export --input ${traceFile} --xpath '/trace-toc/run[@number="1"]/data/table[@schema="time-profile"]' --output ${xmlOutputFile}`
  );
  return xmlOutputFile;
};

const stopPerfRecord = async (
  recordingProcess: ChildProcess,
  traceFile: string,
  onMeasure: (measure: Measure) => void
) => {
  try {
    await new Promise<void>((resolve) => {
      recordingProcess.stdout?.on("data", (data) => {
        if (data.toString().includes("Output file saved as")) {
          resolve();
        }
      });
    });
  } catch (e) {
    console.log("Error while recording: ", e);
  }
  const xmlFile = saveTraceFile(traceFile);
  const measures = computeMeasures(xmlFile);
  measures.forEach((measure) => {
    onMeasure(measure);
  });
  removeTmpFiles();
};

export class IOSInstrumentsProfiler implements Profiler {
  connectedDevice: IdbDevice | undefined;
  recordingProcess: ChildProcess | undefined;
  traceFile: string | undefined;
  pid: number | undefined;
  bundleId: string | undefined;
  onMeasure: ((measure: Measure) => void) | undefined;
  pollPerformanceMeasures(bundleId: string, options: ProfilerPollingOptions): { stop: () => void } {
    if (!this.pid) throw new Error("Profiler is not ready, app is not running");
    this.onMeasure = options.onMeasure;
    return {
      stop: () => {
        return;
      },
    };
  }

  detectCurrentBundleId(): string {
    throw new Error("App Id detection is not implemented on iOS with Instruments");
  }

  installProfilerOnDevice() {
    // Do we need anything here?
  }

  getScreenRecorder(videoPath: string): ScreenRecorder | undefined {
    return undefined;
  }

  cleanup: () => void = () => {
    // Do we need anything here?
  };

  async waitUntilReady(bundleId: string): Promise<void> {
    this.connectedDevice = getConnectedDevice();
    if (!this.connectedDevice) {
      throw new Error("No device connected");
    }
    this.bundleId = bundleId;
    this.pid = launchApp(bundleId);
    const traceFile = `report_${new Date().getTime()}.trace`;
    this.traceFile = traceFile;
    this.recordingProcess = await startRecord(this.connectedDevice.udid, this.pid, traceFile);
  }

  async getMeasures(): Promise<void> {
    if (!this.recordingProcess || !this.traceFile || !this.pid || !this.onMeasure || !this.bundleId)
      throw new Error("Profiler is not ready to get measures");
    const recordingProcess = this.recordingProcess;
    const traceFile = this.traceFile;
    killApp(this.bundleId);
    await stopPerfRecord(recordingProcess, traceFile, this.onMeasure);
  }

  async stopApp(bundleId: string): Promise<void> {
    killApp(bundleId);
    return new Promise<void>((resolve) => resolve());
  }
}
