<!-- Shared rule: keep identical in bamlab/flashlight and bamlab/flashlight-cloud. Source of truth: bamlab/flashlight. -->

# Agent workflow

The skills in `.claude/skills/` are vendored from [mattpocock/skills](https://github.com/mattpocock/skills) (see `.claude/skills/VENDORED.md`) plus a few Flashlight-specific ones. Pick the skill for the situation instead of improvising a process:

```
idea / unclear plan ──► /grill-me  (or /grill-with-docs to also record terms & decisions)
decided feature ──────► /to-spec ──► /to-tickets ──► /implement  (or /implement-spec for the whole spec)
new issue ────────────► /triage
bug / regression ─────► /diagnosing-bugs ──► /tdd
code to write ────────► /tdd   (red → green → refactor, one vertical slice at a time)
diff ready ───────────► /code-review ──► /pr
design question ──────► /prototype   ·   facts from primary sources ──► /research
big, foggy piece of work ► /wayfinder
codebase drift ───────► /improve-codebase-architecture
end of a session ─────► /retro  (improve these rules)  ·  /handoff  (another agent continues)
not sure which ───────► /ask-matt
```

Flashlight-specific skills: `/gdpr-audit`, `/eol-check`, `/security-findings`.

Maintainers also have private Theodo skills (installed from `bamlab/flashlight-internal` with `install-skills.sh`; not available to outside contributors):

```
hard technical decision ─► /adr-writer        (only when it passes its "Is this an ADR?" gate)
risky refactor ──────────► /refactoring       (Mikado: green at every commit)
defect fixed ────────────► /dantotsu          (root cause write-up, French, kept private)
review comments on a PR ─► /fix-pr-comments
weekly (factory) ────────► /kaizen-conv · /kaizen-mr   (improve rules and docs from the week's friction)
audits ──────────────────► /agent-readiness · /dependencies-management-audit
```

## Ground rules for agents

- Read `AGENTS.md`, these rules and `docs/agents/*.md` before working. Read `GLOSSARY.md` and the relevant ADRs when they exist and you have access.
- Work on a branch, end with a **draft** PR. Never merge, never push to `main`, never force-push.
- Run `yarn test` before declaring anything done; paste the result as evidence.
- Ask a human when a decision is product or architecture, not code. Record the answer where it belongs (ADR, spec, glossary) rather than only in chat.
- Stay in scope: fix what the ticket asks. File what else you notice as a new ticket instead of fixing it on the side.
- When a run fails or loops, stop after three attempts and hand back with what you tried.
