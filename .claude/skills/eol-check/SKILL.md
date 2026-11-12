---
name: eol-check
description: Compare the versions of the platform dependencies this repo runs on (Node, React, React Native, Expo, Next.js, Docusaurus, TypeScript, Firebase Functions runtime) against endoflife.date and npm, and say what to upgrade. Use for an EOL / maintenance / "are we up to date" check, or from the factory's weekly run.
---

# EOL check

Goal: upgrade to a new stable release as soon as it's proven (out for at least 14 days), and never run on something past its end of life.

## 1. Collect what this repo uses

Find the version actually in use, and every place that pins it:

| Product               | Where to look                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Node.js               | `.nvmrc`, `engines`, CI `node-version`, `netlify.toml` `NODE_VERSION`, `Dockerfile` `FROM`, `server/firebase.json` `runtime`, `pkg` targets |
| React / React DOM     | `package.json` of each workspace                                                               |
| React Native / Expo   | `package.json` of examples and test apps, peer ranges of published packages                    |
| Next.js               | `frontend/package.json`                                                                        |
| Docusaurus            | `website/package.json`                                                                         |
| TypeScript            | root `package.json`                                                                            |

Read the resolved version from `yarn.lock` when a range is given.

## 2. Compare with upstream

- Lifecycle: `curl -s https://endoflife.date/api/<product>.json` (`nodejs`, `react`, `react-native`, `expo`, `nextjs`, `docusaurus`, `typescript`). Each cycle has `cycle`, `releaseDate`, `eol`, `support`, `latest`, `latestReleaseDate`.
- Latest stable: `npm view <package> time --json` for release dates when endoflife.date lacks the product.

## 3. Decide

For each product:

- **EOL** — our cycle's `eol` date is past → severity **high**.
- **EOL soon** — `eol` within 90 days → **medium**.
- **Upgrade available** — a newer stable cycle or patch whose release is **≥ 14 days old** → **low** (patch/minor) or **medium** (major).
- Ignore releases younger than 14 days, pre-releases and release candidates.
- Note known blockers (e.g. a major that a dependency doesn't support yet — check the ADRs and open issues before proposing it).

## 4. Output

A table: product · in use · latest stable (date) · our cycle EOL · status · action, then for each action one line saying **patch/minor** (safe to upgrade automatically, ends in a draft PR) or **major** (needs a human go: describe blockers and the files to change). Don't upgrade anything in the same run unless asked.
