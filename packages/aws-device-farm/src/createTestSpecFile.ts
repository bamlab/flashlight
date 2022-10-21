import fs from "fs";
import path from "path";
import { TMP_FOLDER } from "./TMP_FOLDER";

const getSingleTestFileYml = ({ testFile }: { testFile: string }) => {
  const testCode = fs.readFileSync(testFile);
  const base64TestCode = Buffer.from(testCode).toString("base64");

  const ymlTemplate = fs
    .readFileSync(`${__dirname}/../flashlight-singlefile.yml`)
    .toString();

  return ymlTemplate.replace("<INSERT_BASE64_TEST_CODE>", base64TestCode);
};

const getTestCommandYml = ({
  testSpecsPath,
  testCommand,
}: {
  testSpecsPath: string;
  testCommand: string;
}) => {
  const previousSpecFileContent = fs.readFileSync(testSpecsPath).toString();
  return previousSpecFileContent.replace("INSERT_TEST_COMMAND", testCommand);
};

export const createTestSpecFile = ({
  testSpecsPath,
  testCommand,
  testFile,
}: {
  testSpecsPath: string;
  testCommand: string;
  testFile?: string;
}): string => {
  const newContent = testFile
    ? getSingleTestFileYml({ testFile })
    : getTestCommandYml({
        testSpecsPath,
        testCommand,
      });

  const newSpecFilePath = `${TMP_FOLDER}/${
    path.basename(testSpecsPath).split(".")[0]
  }_${new Date().getTime()}.yml`;

  fs.writeFileSync(newSpecFilePath, newContent);

  return newSpecFilePath;
};
