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
      { devDependencies: ["**/__tests__/**"] },
    ],
  },
  overrides: [
    {
      files: ["**/__tests__/**", "**/*test.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
