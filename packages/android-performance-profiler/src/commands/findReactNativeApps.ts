import { executeCommand } from "./shell";
import { getPidId } from "./getPidId";
import { getSubProcessesStats } from "./getSubProcessesStats";
import { JS_THREAD_PROCESS_NAME } from "../JS_THREAD_PROCESS_NAME";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const findReactNativeApps = async () => {
  const packages = executeCommand(
    `adb shell pm list packages -3 |cut -f 2 -d ":"`
  )
    .split("\n")
    .map((name) => name.replace("package:", ""));
  console.log(`Found ${packages.length} packages...`);

  for (let index = 0; index < packages.length; index++) {
    const app = packages[index];
    console.log(`Opening package ${index}/${packages.length}: ${app}`);

    executeCommand(` adb shell monkey -p ${app} 1`);
    await sleep(3000);

    const pidId = await getPidId(app);
    const subProcesses = await getSubProcessesStats(pidId);

    console.log(
      `Trace of JS thread: ${!!subProcesses.find(
        (process) => process.processName === JS_THREAD_PROCESS_NAME
      )}`
    );
    console.log("=======================");
  }
};
