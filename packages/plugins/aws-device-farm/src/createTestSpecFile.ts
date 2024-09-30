import fs from "fs";
import { buildYmlSpec, Commands } from "./buildYmlSpec";
import { TMP_FOLDER } from "./TMP_FOLDER";

const buildAppiumYmlSpec = (commands: {
  testCommands: string[];
  postTestCommands?: string[];
  installCommands?: string[];
  preTestCommands?: string[];
}) =>
  buildYmlSpec({
    ...commands,
    installCommands: [
      ...Commands.INSTALL_NODE,
      ...Commands.UNPACKAGE_TEST_PACKAGE,
      ...(commands.installCommands || []),
    ],
    preTestCommands: [...Commands.START_APPIUM, ...(commands.preTestCommands || [])],
    testCommands: [
      ...Commands.NAVIGATE_TO_TEST_SOURCE_CODE,
      ...commands.testCommands,
      ...Commands.MOVE_RESULTS_TO_ARTIFACTS,
    ],
  });

export const getSingleTestFileYml = ({
  testFile,
  postTestCommand = "echo 'Tests are done!",
}: {
  testFile: string;
  postTestCommand?: string;
}) => {
  const testCode = fs.readFileSync(testFile).toString();

  return buildAppiumYmlSpec({
    testCommands: [...Commands.createFile(testCode, "runTest.ts"), "npx ts-node runTest.ts"],
    postTestCommands: [postTestCommand].filter(Boolean),
  });
};

export const getTestCommandYml = ({ testCommand }: { testCommand: string }) => {
  return buildAppiumYmlSpec({
    installCommands: ["npm install --global yarn"],
    testCommands: ["yarn install --production --ignore-engines", testCommand],
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
