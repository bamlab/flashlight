import { execSync } from "child_process";

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
    const data = execSync(shellCommand).toString();

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
