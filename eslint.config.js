const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");
const prettierRecommended = require("eslint-plugin-prettier/recommended");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const testingLibrary = require("eslint-plugin-testing-library");

module.exports = tseslint.config(
  {
    // eslint 9 reports unused disable directives by default; eslint 8 did not. Keep it off:
    // website/ deps are installed separately, so its directives are only unused locally.
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/docs/**",
      "**/cpp-profiler/**",
      "**/.docusaurus/**",
      "**/report.js",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettierRecommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/__tests__/**",
            // web app will be built with parcel in the dist folder, so we only package the final html/js files, not the deps
            "**/packages/commands/measure/src/webapp/**",
            "**/packages/core/web-reporter-ui/utils/testUtils.ts",
            "**/packages/commands/report/src/**",
            "**/*.config.js", // This is necessary for tailwind.config.js in both web-reporter and web-reporter-ui
          ],
        },
      ],
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  {
    // Config files and the custom-rules plugin entry point are CommonJS
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/__tests__/**", "**/*test.ts"],
    extends: [testingLibrary.configs["flat/react"]],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);
