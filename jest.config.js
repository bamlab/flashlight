const commonOptions = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "\\.snap$",
    "/node_modules/",
    "/dist/",
    "/examples/e2e/",
  ],
};

module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/cpp-profiler/**",
  ],
  setupFiles: ['<rootDir>/jest-setup.ts'],

  projects: [
    {
      ...commonOptions,
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/packages/web-reporter-ui/**/*.test.{ts,tsx}"
      ],
    },
    {
      ...commonOptions,
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["<rootDir>/packages/@aws-device-farm/**/*.test.{ts,tsx}"]
    },
  ],
};
