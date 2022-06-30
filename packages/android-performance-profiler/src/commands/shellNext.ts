import { exec, execSync } from "child_process";

export const executeCommand = (command: string): string => {
  return execSync(command).toString();
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
  dataCallback: { (data: any): void },
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

  const loopCommand = `while true; do ${fullCommand} sleep ${interval}; done`;
  // For tests purposes, run in local shell
  const shellCommand = runInAdb
    ? `adb shell "{ ${loopCommand} }"`
    : loopCommand;

  const process = exec(shellCommand);
  process.stdout?.on("data", (data) => {
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
  });

  return {
    stop: () => process.kill(),
  };
};
