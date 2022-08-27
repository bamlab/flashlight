import fs from "fs";
import path from "path";

export const createTestSpecFile = ({
  testSpecsPath,
  testCommand,
}: {
  testSpecsPath: string;
  testCommand: string;
}): string => {
  const previousSpecFileContent = fs.readFileSync(testSpecsPath).toString();
  const newContent = previousSpecFileContent.replace(
    "INSERT_TEST_COMMAND",
    testCommand
  );

  const newSpecFilePath = `${
    path.basename(testSpecsPath).split(".")[0]
  }_${new Date().getTime()}.yml`;

  fs.writeFileSync(newSpecFilePath, newContent);

  return newSpecFilePath;
};
