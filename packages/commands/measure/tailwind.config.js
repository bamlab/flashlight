const tailwindConfig = require("@perf-profiler/web-reporter-ui/tailwind.config");

module.exports = {
  content: [...tailwindConfig.content, "./src/webapp/**/*.tsx"],
  presets: [tailwindConfig],
};
