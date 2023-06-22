import fs from "fs";
import { buildYmlSpec, Commands } from "./buildYmlSpec";
import { TMP_FOLDER } from "./TMP_FOLDER";

export const getSingleTestFileYml = ({
  testFile,
  postTestCommand = "echo 'Tests are done!",
}: {
  testFile: string;
  postTestCommand?: string;
}) => {
  const testCode = fs.readFileSync(testFile).toString();

  return buildYmlSpec({
    installCommands: [...Commands.INSTALL_APPIUM],
    preTestCommands: [...Commands.START_APPIUM],
    testCommands: [...Commands.createFile(testCode, "runTest.ts"), "npx ts-node runTest.ts"],
    postTestCommands: [postTestCommand].filter(Boolean),
  });
};

export const getTestCommandYml = ({ testCommand }: { testCommand: string }) => {
  return buildYmlSpec({
    preTestCommands: [...Commands.START_APPIUM],
    installCommands: [...Commands.INSTALL_APPIUM, "npm install --global yarn"],
    testCommands: ["yarn", testCommand],
  });
};

export const createTestSpecFile = ({
  testCommand,
  testFile,
  postTestCommand,
}: {
  testCommand?: string;
  testFile?: string;
  postTestCommand?: string;
}): string => {
  let newContent;

  if (testFile) {
    newContent = getSingleTestFileYml({ testFile, postTestCommand });
  } else if (testCommand) {
    newContent = getTestCommandYml({
      testCommand,
    });
  } else {
    throw new Error("Neither testCommand nor testFile was passed.");
  }

  const newSpecFilePath = `${TMP_FOLDER}/specs_${new Date().getTime()}.yml`;

  fs.writeFileSync(newSpecFilePath, newContent);

  return newSpecFilePath;
};
