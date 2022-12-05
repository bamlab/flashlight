import yaml from "js-yaml";
export const Commands = {
  INSTALL_NVM: [
    "export NVM_DIR=$HOME/.nvm",
    ". $NVM_DIR/nvm.sh",
    "nvm install 16",
  ],
  UNPACKAGE_TEST_PACKAGE: [
    'echo "Navigate to test package directory"',
    "cd $DEVICEFARM_TEST_PACKAGE_PATH",
    "npm install *.tgz",
  ],
  INSTALL_APPIUM: [
    "export APPIUM_VERSION=1.22.2",
    "avm $APPIUM_VERSION",
    "ln -s /usr/local/avm/versions/$APPIUM_VERSION/node_modules/.bin/appium /usr/local/avm/versions/$APPIUM_VERSION/node_modules/appium/bin/appium.js",
  ],
  START_APPIUM: [
    'echo "Start appium server"',
    `appium --log-timestamp --default-capabilities "{\\"deviceName\\": \\"$DEVICEFARM_DEVICE_NAME\\", \\"platformName\\":\\"$DEVICEFARM_DEVICE_PLATFORM_NAME\\",\\"app\\":\\"$DEVICEFARM_APP_PATH\\", \\"udid\\":\\"$DEVICEFARM_DEVICE_UDID\\", \\"platformVersion\\":\\"$DEVICEFARM_DEVICE_OS_VERSION\\",\\"chromedriverExecutable\\":\\"$DEVICEFARM_CHROMEDRIVER_EXECUTABLE\\"}" >> $DEVICEFARM_LOG_DIR/appiumlog.txt 2>&1 &`,
    `start_appium_timeout=0;
while [ true ];
do
    if [ $start_appium_timeout -gt 60 ];
    then
        echo "appium server never started in 60 seconds. Exiting";
        exit 1;
    fi;
    grep -i "Appium REST http interface listener started on 0.0.0.0:4723" $DEVICEFARM_LOG_DIR/appiumlog.txt >> /dev/null 2>&1;
    if [ $? -eq 0 ];
    then
        echo "Appium REST http interface listener started on 0.0.0.0:4723";
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
    phases: {
      install: {
        commands: [
          ...Commands.INSTALL_NVM,
          ...Commands.UNPACKAGE_TEST_PACKAGE,
          ...(installCommands || []),
        ],
      },
      pre_test: {
        commands: [...(preTestCommands || [])],
      },
      test: {
        commands: [
          ...Commands.NAVIGATE_TO_TEST_SOURCE_CODE,
          ...testCommands,
          "mv result*.json $DEVICEFARM_LOG_DIR",
        ],
      },
      post_test: {
        commands: postTestCommands,
      },
    },
    artifacts: ["$DEVICEFARM_LOG_DIR"],
  };

  return yaml.dump(testJsonSpec);
};
