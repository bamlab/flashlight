# Contributing

## Commit naming

We use [conventional changelogs](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary) for commits and PR names

It should be like:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

- [ ] with type = feat/fix/refactor/chore/docs/test/…
- [ ] description should be lowercase and start with a verb

Here are some examples https://www.conventionalcommits.org/en/v1.0.0-beta.4/#examples

## Running `flashlight` commands locally

Start by building the whole project:

At the root of the repo:

```
yarn
yarn watch
```

Keep this open in one terminal.

### `measure` command

Start the webapp with

```bash
yarn workspace @perf-profiler/measure start
```

Then run the `measure` commmand with:

```bash
DEVELOPMENT_MODE=true node packages/commands/measure/dist/server/bin.js measure
```

### `test` command

To run the command locally:

```
node packages/commands/test/dist/bin.js test
```

This command is the equivalent of

```
flashlight test
```

### `tools` command

To run the command locally:

```
node packages/commands/tools/dist/bin.js tools
```

This command is the equivalent of

```
flashlight tools
```

### web-reporter

Run in another terminal:

```
yarn workspace @perf-profiler/web-reporter start
```

Then in `packages/commands/report/src/App.tsx`, uncomment the lines to add your own measures:

```ts
// Uncomment with when locally testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
testCaseResults = [require("../measures.json")];
```

You should now be able to open [the local server](http://localhost:1234/)

Run `yarn jest Plugin -u` after modifications.

### Running the docs website locally

[See details here](./website/README.md)
