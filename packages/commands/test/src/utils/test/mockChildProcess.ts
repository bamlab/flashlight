jest.mock("child_process", () => {
  return {
    spawn: jest.requireActual("child_process").spawn,
    execSync: (command: string) => ({
      toString: () => {
        if (
          command.startsWith("adb push") &&
          command.endsWith("BAMPerfProfiler-arm64-v8a /data/local/tmp/BAMPerfProfiler")
        ) {
          return "";
        }

        switch (command) {
          case "adb shell /data/local/tmp/BAMPerfProfiler printCpuClockTick":
            return 100;
          case "adb shell dumpsys window windows":
            return "      mSurface=Surface(name=com.example/com.example.MainActivity$_21455)/@0x9110fea";
          case "adb shell /data/local/tmp/BAMPerfProfiler printRAMPageSize":
            return 4096;
          case "adb shell getprop ro.product.cpu.abi":
            return "arm64-v8a";
          case "adb shell getprop ro.build.version.sdk":
            return "30";
          case 'adb shell dumpsys display | grep -E "mRefreshRate|DisplayDeviceInfo"':
            return "fps=120";
          case "adb shell setprop debug.hwui.profile true":
          case "adb shell atrace --async_stop 1>/dev/null":
          case "adb shell chmod 755 /data/local/tmp/BAMPerfProfiler":
            return "";
          default:
            console.error(`Unknown command: ${command}`);
            return "";
        }
      },
    }),
  };
});
