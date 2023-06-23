const commonOptions = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "\\.snap$",
    "/node_modules/",
    "/dist/",
    "/examples/e2e/",
    "/measure/src/__tests__/utils/"
  ],
  setupFiles: ["<rootDir>/jest-setup.ts"],
};

const WEB_PACKAGES = [
  "flipper-plugin-android-performance-profiler",
  "measure",
  "web-reporter-ui",
];
const NODE_PACKAGES = [
  "android-performance-profiler",
  "appium-helper",
  "appium-test-cases",
  "aws-device-farm",
  "e2e-performance",
  "eslint-plugin-flashlight-eslint-rules",
  "reporter",
  "shell",
  "web-reporter",
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
