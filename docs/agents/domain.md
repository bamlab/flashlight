# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root: the project's vocabulary (measure, iteration, report, score, …). Public.
- **Architecture Decision Records are private.** They live in the private companion repo `bamlab/flashlight-internal`, not here. Maintainers clone it next to this repo: if `../flashlight-internal/docs/adrs/` exists, read the ADRs that touch your area (index in its `README.md`). Otherwise proceed without them.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## Writing domain docs

- New or sharper **terms** → `GLOSSARY.md` here (single-context: one glossary for the whole repo).
- New **decisions** (ADRs) → only for **hard technical decisions**: costly to reverse (formats, published APIs, infrastructure), several credible options with real trade-offs, constraining future work. Everything else goes in the PR description or the spec. Maintainers write them with `/adr-writer`, **never in this repo:** write them in `../flashlight-internal/docs/adrs/NNNN-title.md` (template in its `README.md`) and open the PR on `bamlab/flashlight-internal`. If you can't reach that repo, hand the decision back to the maintainer instead of writing it here.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (…), but worth reopening because…_
