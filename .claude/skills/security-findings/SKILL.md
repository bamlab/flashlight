---
name: security-findings
description: Route a security, secret or GDPR finding to the right private place instead of a public issue. Use whenever you have found a vulnerability, leaked secret, personal-data exposure or GDPR gap — from an audit, a review, or while working on something else.
---

# Security findings

Security and GDPR findings are never written in the public repo (`bamlab/flashlight`): not in an issue, a PR, a commit message or a code comment.

## Route

```
finding
 ├─ a live secret is exposed ──────────────► STOP. Tell the maintainer now (it must be rotated). Don't write the value anywhere.
 ├─ a public dependency CVE (already disclosed) ► normal fix PR is fine; reference the advisory ID
 └─ anything else ─────────────────────────► private issue in bamlab/flashlight-cloud
                                               (or a private security advisory on bamlab/flashlight
                                                when an outside reporter must be credited)
```

## Private issue format

```bash
gh issue create -R bamlab/flashlight-cloud \
  --title "security(<area>): <short description>" \
  --label "needs-triage" \
  --body-file <file>
```

Body:

- **Severity** — critical / high / medium / low (definitions in `/gdpr-audit`).
- **Kind** — secret · vulnerability · personal data · retention · consent.
- **Where** — repo and `file:line` (for public code, say `bamlab/flashlight` explicitly).
- **What happens** — what data or capability is exposed, to whom.
- **Fix** — the smallest change that closes it.
- **Found by** — the run, audit or session that found it.

Before creating, search for an existing open issue on the same `file:line` and comment there instead of filing a duplicate.

If you can't reach `bamlab/flashlight-cloud` (outside contributor), don't file anything public: open a private security advisory at https://github.com/bamlab/flashlight/security/advisories/new, as `SECURITY.md` describes.
