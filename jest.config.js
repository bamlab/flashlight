const commonOptions = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "\\.snap$",
    "/node_modules/",
    "/dist/",
    "/examples/e2e/",
    "/measure/src/__tests__/utils/",
  ],
  setupFiles: ["<rootDir>/jest-setup.ts"],
};

const WEB_PACKAGES = ["plugins/flipper", "commands/measure", "core/web-reporter-ui"];

const NODE_PACKAGES = [
  "platforms/android",
  "plugins/appium-helper",
  "plugins/appium-test-cases",
  "plugins/aws-device-farm",
  "commands/test",
  "plugins/eslint",
  "core/reporter",
  "core/shell",
  "commands/report",
];

module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/cpp-profiler/**",
  ],

  projects: [
    ...WEB_PACKAGES.map((name) => ({
      name,
      testEnvironment: "jsdom",
    })),
    ...NODE_PACKAGES.map((name) => ({
      name,
      testEnvironment: "node",
    })),
  ].map(({ name, testEnvironment }) => ({
    ...commonOptions,
    displayName: name,
    testEnvironment,
    testMatch: [`<rootDir>/packages/${name}/**/__tests__/*.{ts,tsx}`],
  })),
};
