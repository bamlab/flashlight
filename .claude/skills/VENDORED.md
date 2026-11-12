# Vendored skills

Most skills in this folder are copied unmodified from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © Matt Pocock).

- Source commit: `5863806dd4e15c63174bee4e7515a4256792ecfa`
- Copied: `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder` (from `skills/engineering/`) and `grill-me`, `grilling`, `handoff`, `to-questionnaire`, `wait-what`, `writing-for-agents` (from `skills/productivity/`).

Flashlight-specific skills (ours, edit freely): `gdpr-audit`, `eol-check`, `security-findings`.

Per-repo configuration the vendored skills read lives in `docs/agents/` — change behaviour there, not by editing the vendored files.

## Updating

Don't edit vendored skills in place; changes would be lost on the next update. To update, copy the same folders from a newer upstream commit, update the commit above, and review the diff in the PR like any other code — skills are instructions agents will follow.

```bash
git clone --depth 1 https://github.com/mattpocock/skills /tmp/mp
for s in <the folders listed above>; do rm -rf .claude/skills/$s; cp -R /tmp/mp/skills/*/$s .claude/skills/; done
git -C /tmp/mp rev-parse HEAD   # paste into "Source commit"
```
