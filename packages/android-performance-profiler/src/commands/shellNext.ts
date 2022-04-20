import { exec, execSync } from "child_process";

export const executeCommand = (command: string): string => {
  return execSync(command).toString();
};

export const execLoopCommands = (
  commands: {
    id: string;
    command: string;
  }[],
  interval: number,
  dataCallback: { (data: any): void }
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

  // const startPoint = getStartPoint(commands[0].id);
  const endPoint = getEndPoint(commands[commands.length - 1]?.id || "");

  const LINE_BREAK_CHAR_COUNT = "\n".length;

  console.log(
    "RUNNING COMMAND: ",
    `adb shell "{ while true; do ${fullCommand} sleep ${interval}; done }"`
  );
  return exec(
    `adb shell "{ while true; do ${fullCommand} sleep ${interval}; done }"`
  ).stdout?.on("data", (data) => {
    console.log(data);
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
};

execLoopCommands(
  [
    { id: "ls", command: "ls" },
    { id: "proc", command: "ls proc" },
  ],
  0.5,
  (data) => {
    console.log("HELLO", data);
  }
);
