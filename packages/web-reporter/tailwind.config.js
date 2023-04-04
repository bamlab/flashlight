module.exports = {
  content: [
    ...require('@perf-profiler/web-reporter-ui/tailwind.config').content,
    "./src/App.tsx"
  ],
  presets: [
    require('@perf-profiler/web-reporter-ui/tailwind.config')
  ],
}
