import fs from "fs";
import { buildYmlSpec } from "./buildYmlSpec";
import { TMP_FOLDER } from "./TMP_FOLDER";

export const getSingleTestFileYml = ({
  testFile,
  postTestCommand = "echo 'Tests are done!",
}: {
  testFile: string;
  postTestCommand?: string;
}) => {
  const testCode = fs.readFileSync(testFile);
  const base64TestCode = Buffer.from(testCode).toString("base64");

  return buildYmlSpec({
    testCommands: [
      `echo ${base64TestCode} | base64 -d  > runTest.ts`,
      "npx ts-node runTest.ts",
    ],
    postTestCommands: [postTestCommand].filter(Boolean),
  });
};

export const getTestCommandYml = ({ testCommand }: { testCommand: string }) => {
  return buildYmlSpec({
    installCommands: ["npm install --global yarn"],
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
