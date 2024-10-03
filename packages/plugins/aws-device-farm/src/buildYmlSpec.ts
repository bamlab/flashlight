import { dump } from "js-yaml";

const APPIUM_VERSION = "2.11.4";

export const Commands = {
  INSTALL_NODE: ["devicefarm-cli use node 18", "node -v"],
  UNPACKAGE_TEST_PACKAGE: [
    'echo "Navigate to test package directory"',
    "cd $DEVICEFARM_TEST_PACKAGE_PATH",
    "npm install *.tgz",
  ],
  START_APPIUM: [
    'echo "Start appium server"',
    `npx appium@${APPIUM_VERSION} driver install uiautomator2`,
    `npx appium@${APPIUM_VERSION} --log-timestamp --default-capabilities "{\\"appium:deviceName\\": \\"$DEVICEFARM_DEVICE_NAME\\", \\"appium:platformName\\":\\"$DEVICEFARM_DEVICE_PLATFORM_NAME\\",\\"appium:app\\":\\"$DEVICEFARM_APP_PATH\\", \\"appium:udid\\":\\"$DEVICEFARM_DEVICE_UDID\\", \\"appium:platformVersion\\":\\"$DEVICEFARM_DEVICE_OS_VERSION\\",\\"appium:chromedriverExecutable\\":\\"$DEVICEFARM_CHROMEDRIVER_EXECUTABLE\\"}" >> $DEVICEFARM_LOG_DIR/appiumlog.txt 2>&1 &`,
    `start_appium_timeout=0;
while [ true ];
do
    if [ $start_appium_timeout -gt 60 ];
    then
        echo "appium server never started in 60 seconds. Exiting";
        exit 1;
    fi;
    grep -i "Appium REST http interface listener started on http://0.0.0.0:4723" $DEVICEFARM_LOG_DIR/appiumlog.txt >> /dev/null 2>&1;
    if [ $? -eq 0 ];
    then
        echo "Appium REST http interface listener started on http://0.0.0.0:4723";
        break;
    else
        echo "Waiting for appium server to start. Sleeping for 1 second";
        sleep 1;
        start_appium_timeout=$((start_appium_timeout+1));
    fi;
done;`,
  ],
  NAVIGATE_TO_TEST_SOURCE_CODE: [
    'echo "Navigate to test source code"',
    "cd $DEVICEFARM_TEST_PACKAGE_PATH/node_modules/*",
  ],
  createFile: (code: string, filePath: string) => [
    `echo ${Buffer.from(code).toString("base64")} | base64 -d  > ${filePath}`,
  ],
  MOVE_RESULTS_TO_ARTIFACTS: [
    "mv result*.json $DEVICEFARM_LOG_DIR",
    "mv *.mp4 $DEVICEFARM_LOG_DIR || true",
  ],
};

export const buildYmlSpec = ({
  installCommands,
  preTestCommands,
  testCommands,
  postTestCommands,
}: {
  installCommands?: string[];
  preTestCommands?: string[];
  testCommands: string[];
  postTestCommands?: string[];
}) => {
  const testJsonSpec = {
    version: 0.1,
    android_test_host: "amazon_linux_2",
    phases: {
      install: {
        commands: [...(installCommands || [])],
      },
      pre_test: {
        commands: [...(preTestCommands || [])],
      },
      test: {
        commands: [...testCommands],
      },
      post_test: {
        commands: postTestCommands,
      },
    },
    artifacts: ["$DEVICEFARM_LOG_DIR"],
  };

  return dump(testJsonSpec);
};
