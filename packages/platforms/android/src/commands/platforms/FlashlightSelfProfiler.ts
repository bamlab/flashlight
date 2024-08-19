import { AndroidProfiler } from "./AndroidProfiler";
import { CppProfilerName } from "./UnixProfiler";

export class FlashlightSelfProfiler extends AndroidProfiler {
  // Kinda hacky we just use exactly the same code as in AndroidProfiler
  // but don't start atrace
  protected startATrace(): void {}
  protected stopATrace(): void {}
  public supportFPS(): boolean {
    return false;
  }

  public detectCurrentBundleId(): string {
    return CppProfilerName;
  }

  public detectDeviceRefreshRate(): number {
    return 60;
  }

  /**
   * If we don't override this we end up in a situation where we have:
   *
   * 1. a normal Flashlight process measuring an app
   * 2. another Flashlight process measuring the performance of Flashlight
   *
   * But since both have the same name, we might end up having our 2nd process
   * measuring the performance of itself instead of the 1st process
   */
  public getDeviceProfilerPath(): string {
    return `${super.getDeviceProfilerPath()}_SELF_REPORT`;
  }
}
