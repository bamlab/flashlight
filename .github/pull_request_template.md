<!-- Title: a conventional commit, e.g. `feat(cli): add --foo` or `fix(server): …` -->

Closes #<!-- issue number; for a fix, the issue that reports the bug -->

## Description

<!-- What changes and why, in a few lines. Who notices the difference. A small diagram, tree or diff-sketch helps more than prose (see `/pr`). -->

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor, chore or dependencies
- [ ] Docs
- [ ] Breaking change (users or API consumers must change something)

## What to look at

<!-- Where the reviewer should spend their attention: the tricky logic, the decision you are unsure of, `file:line` links. Say what can be skimmed (generated files, renames, lockfile). -->

-

## Validation

<!-- Feature: screenshots or a short video of it working (web: screenshots; CLI: terminal output).
     Bug fix: before vs after — screenshots, output, or the test that failed and now passes. -->

| Before | After |
| ------ | ----- |
|        |       |

**How to test it:**

1.

## Merge danger

**Door:** <!-- two-way (easy to roll back) or one-way (data migration, published package, deleted data…) -->

**Blast radius:** <!-- who or what breaks if this is wrong -->

## Checklist

- [ ] `yarn test` passes (prettier, build, eslint, jest)
- [ ] New behaviour has a test; a bug fix has a test that reproduces the bug
- [ ] User-facing change: docs updated (`website/`, README)
- [ ] No secret, personal data or internal link (Notion, runbooks, internal URLs) in the code, PR or commits
- [ ] One concern per PR, conventional title
