// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindConfig = require("@perf-profiler/web-reporter-ui/tailwind.config");

module.exports = {
  content: [...tailwindConfig.content, "./src/App.tsx"],
  presets: [tailwindConfig],
};
