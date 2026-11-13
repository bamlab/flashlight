<!-- Shared rule: keep identical in bamlab/flashlight and bamlab/flashlight-cloud. Source of truth: bamlab/flashlight. -->

# Engineering standards

These apply to every change, by a human or an agent, in `bamlab/flashlight` and `bamlab/flashlight-cloud`.

## Done means green

A change is done when `yarn test` passes from the repo root. It runs, in order: `prettier --check .`, `yarn build` (`tsc --build`), `eslint . --max-warnings 0` and `jest`. CI runs exactly this; run it locally before opening a PR. Never weaken a check (skip a test, add `eslint-disable`, loosen `tsconfig`, add `--no-verify`) to get green — fix the cause or stop and say why.

## Toolchain

- Node 22. Yarn classic (1.x) with workspaces: `yarn`, `yarn workspace <name> <script>`. Never use npm or pnpm to install.
- TypeScript `strict` everywhere. No `any` unless the boundary is genuinely untyped, and then narrow it immediately (zod at I/O boundaries).
- Prettier (`printWidth: 100`) and ESLint flat config are the formatting authority. Don't hand-format.
- A new dependency needs a reason in the PR body. Prefer what's already in the workspace. Runtime deps go in the package that uses them, dev-only deps in `devDependencies` (`import/no-extraneous-dependencies` enforces this).

## Code

- Follow the layout of the package you're in; don't invent a new one. Classes/components in `PascalCase.ts(x)`, functions/utilities in `camelCase.ts`.
- Log through `Logger` from `@perf-profiler/logger` (`debug`, `info`, `success`, `warn`, `error`), never `console.log` in shipped code. Scripts under `scripts/` may print, but never personal data (see `privacy-and-security.md`).
- Throw named `Error` subclasses for errors a caller is expected to handle. Don't `process.exit` outside a CLI entry point (`bin.ts`).
- Keep modules deep: a small interface hiding a lot of behaviour. When a change makes a module shallower, say so in the PR.
- Use the project's domain terms (see `GLOSSARY.md` when it exists). Don't introduce synonyms.

## Tests

- Tests live in a `__tests__/` folder next to the code, named `*.test.ts(x)`. Snapshots go in `__snapshots__`, fixtures next to the test.
- New behaviour comes with a test that fails without it (`/tdd`). A bug fix comes with the test that reproduces the bug.
- Tests must be deterministic: no real network, no wall-clock or random dependence (the jest setup already stubs `Math.random`), `TZ=Europe/Paris` assumed.
- Fixtures must not contain real personal data (real device dumps, real emails, signed URLs). Anonymise them.

## Git and PRs

- Conventional commits for commits and PR titles: `type(scope): description`, lowercase, imperative verb. Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`. Lerna builds changelogs from them.
- One concern per PR. PRs are squash-merged; the PR title becomes the commit.
- PR body follows `/pr`: what changed and why, evidence it works (test output, screenshots for UI), and the merge risk.
- **Every PR is traced to a Notion EPIC** (Flashlight - EPICs kanban), and Notion stays internal: no Notion link in `bamlab/flashlight` (public), not in a PR, an issue or a commit.
  - `bamlab/flashlight-cloud` (private): put the EPIC URL on the `**Notion EPIC:**` line of the PR template.
  - `bamlab/flashlight` (public): link the GitHub issue only (`Closes #n`), then add the PR link to the EPIC page in Notion.
  - Maintenance with no feature of its own (dependencies, CVEs, EOL upgrades, CI, agent rules, refactors) belongs to the EPIC « Maintenance de Flashlight ». No fitting EPIC: create one first with `/log-task`.
- Never push to `main`, never force-push a shared branch, never merge your own PR as an agent.
