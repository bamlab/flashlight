module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "\\.snap$",
    "/node_modules/",
    "/dist/",
    "/examples/e2e/",
  ],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/cpp-profiler/**",
  ],
  setupFiles: ['<rootDir>/jest-setup.ts'],
};
