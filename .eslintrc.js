module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "react-app/jest",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
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
  ignorePatterns: ["dist", "node_modules", "docs", "cpp-profiler", ".docusaurus", "report.js"],
  overrides: [
    {
      files: ["**/__tests__/**", "**/*test.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
