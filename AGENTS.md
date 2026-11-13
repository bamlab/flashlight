# Flashlight — guide for contributors and coding agents

Flashlight measures the performance of mobile apps (FPS, CPU, RAM) and produces a score and an HTML report. This repo is the open-source CLI and libraries, published as `@perf-profiler/*` on npm. Docs: https://docs.flashlight.dev.

Humans and agents follow the same rules. Start here, then read the files linked below.

## Map

```
packages/
├─ core/       types · logger · shell · reporter · web-reporter-ui (React report UI)
├─ platforms/  android (adb + C++ profiler) · ios · ios-instruments · profiler (facade)
├─ commands/   test (`flashlight test`) · measure (`flashlight measure`, ink + webapp) · report · tools
└─ plugins/    aws-device-farm · appium-helper · appium-test-cases · eslint
examples/      cli · e2e (private, not published)
website/       Docusaurus docs site (own yarn.lock, deployed by Netlify)
```

## Commands

```bash
yarn                  # install (Yarn classic, Node 22)
yarn watch            # tsc --build --watch while developing
yarn test             # prettier --check · build · eslint --max-warnings 0 · jest  ← must pass
yarn jest <pattern>   # run some tests
```

Package-specific dev loops (measure, report, web-reporter) are in `CONTRIBUTING.md`.

## Rules

- `.claude/rules/engineering-standards.md` — toolchain, code, tests, commits and PRs.
- `.claude/rules/privacy-and-security.md` — **this repo is public**: what must never be written here, secrets, personal data, untrusted input.
- `.claude/rules/agent-workflow.md` — which skill to use when, and ground rules for agents.

## Agent skills

Skills live in `.claude/skills/` (vendored from mattpocock/skills, see `VENDORED.md`, plus `gdpr-audit`, `eol-check`, `security-findings`).

### Issue tracker

GitHub Issues on `bamlab/flashlight`; security and GDPR findings go to a private tracker instead. See `docs/agents/issue-tracker.md`.

### Triage labels

The five triage roles use the canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), plus scope, status, type and priority labels shared with the private repos. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: public `GLOSSARY.md` at the root; ADRs are private to the maintainers. See `docs/agents/domain.md`.
