# Contributing

Start by building the whole project:

At the root of the repo:

```
yarn
yarn watch
```

Keep this open in one terminal.

### web-reporter

and run in another terminal:

```
yarn workspace @perf-profiler/web-reporter report start
```

Then in `packages/web-reporter/src/App.tsx`, uncomment the lines to add your own measures:

```ts
// Uncomment with when locally testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
testCaseResults = [require("../measures.json")];
```

You should now be able to open [the local server](http://localhost:1234/)

Run `yarn jest Plugin -u` after modifications.

### e2e

You can now run `node packages/e2e-performance/dist/bin.js` instead of `npx @perf-profiler/e2e`

### Flipper plugin

- Add the path to the `packages` folder in `~/.flipper/config.json`.

For instance, my `config.json` is currently
`{"pluginPaths":["/Users/almouro/dev/projects/android-performance-profiler/packages"],"disabledPlugins":[],"darkMode":"system","updaterEnabled":true,"launcherEnabled":true,"lastWindowPosition":{"x":-195,"y":-1415,"width":1280,"height":1415}}`

- in the `packages/flipper-plugin-android-performance-profiler`, run `yarn watch`.

You should now see your local plugin in Flipper (ensure you have uninstalled the one from the marketplace), in the disabled plugin section if you're installing for the first time.

⚠️ _when modifying files outside of the `packages/flipper-plugin-android-performance-profiler`, live reload sometimes doesn't work and you need to re-run `yarn watch` for changes to take effect_ 😕
