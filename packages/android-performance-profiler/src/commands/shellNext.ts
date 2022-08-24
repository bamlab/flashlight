import { Logger } from "@perf-profiler/logger";
import { execSync, spawn } from "child_process";

export const executeCommand = (command: string): string => {
  try {
    return execSync(command, { stdio: "pipe" }).toString();
  } catch (error: any) {
    Logger.debug(
      `Error while executing command "${command}": ${error.stderr.toString()}`
    );
    throw error;
  }
};

export const executeLongRunningProcess = (
  command: string,
  delimiter: string,
  onData: (data: string) => void
) => {
  const parts = command.split(" ");

  const process = spawn(parts[0], parts.slice(1));

  let currentChunk = "";

  process.stdout?.on("data", (data: ReadableStream<string>) => {
    currentChunk += data.toString();

    const dataSplits = currentChunk.split(delimiter);

    dataSplits.slice(0, -1).forEach((split) => {
      onData(split.trim());
    });

    if (dataSplits.length > 0) {
      currentChunk = currentChunk.slice(
        currentChunk.length - 1 * dataSplits[dataSplits.length - 1].length
      );
    }
  });

  process.stdout?.on("end", () => {
    Logger.debug("Polling ended");
  });

  process.on("close", (code) => {
    Logger.debug(`child process exited with code ${code}`);
  });

  process.on("error", (err) => {
    Logger.error(`Pollling errored with ${err}`);
  });

  return {
    stop: () => {
      process.kill();
    },
  };
};

/**
 * The point of this is to limit round trip via "adb shell" which drastically slows down
 * performance of this tool
 *
 * Instead we pass all our commands, execute them all on adb shell in one go and return the
 * results
 */
export const execLoopCommands = (
  commands: {
    id: string;
    command: string;
  }[],
  interval: number,
  dataCallback: { (data: Record<string, string>): void },
  runInAdb = true
) => {
  if (commands.length < 1) return;

  let currentOutput = "";

  const getStartPoint = (id: string) => `__START__${id}`;
  const getEndPoint = (id: string) => `__STOP__${id}`;

  const fullCommand = commands
    .map(
      ({ command, id }) =>
        `echo ${getStartPoint(id)}; ${command}; echo ${getEndPoint(id)};`
    )
    .join("");

  const endPoint = getEndPoint(commands[commands.length - 1]?.id || "");

  const LINE_BREAK_CHAR_COUNT = "\n".length;

  // We used to run the loop in adb shell but timings weren't accurate
  // const loopCommand = `while true; do ${fullCommand} sleep ${interval}; done`;
  // For tests purposes, run in local shell
  const shellCommand = runInAdb
    ? `adb shell "{ ${fullCommand} }"`
    : fullCommand;

  const polling = setInterval(() => {
    const data = executeCommand(shellCommand);

    currentOutput += data;

    const endPointIndex = currentOutput.indexOf(endPoint);

    if (endPointIndex > -1) {
      dataCallback(
        commands.reduce(
          (aggr, { id }) => ({
            ...aggr,
            [id]: currentOutput.substring(
              currentOutput.indexOf(getStartPoint(id)) +
                getStartPoint(id).length +
                LINE_BREAK_CHAR_COUNT,
              currentOutput.indexOf(getEndPoint(id)) - LINE_BREAK_CHAR_COUNT
            ),
          }),
          {}
        )
      );

      currentOutput = currentOutput.substring(endPointIndex + endPoint.length);
    }
  }, interval * 1000);

  return {
    stop: () => {
      clearInterval(polling);
    },
  };
};
