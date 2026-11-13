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
 ├─ in the CLI stack (bamlab/flashlight) ───► private issue in bamlab/flashlight-internal
 │                                             (or a private security advisory on bamlab/flashlight
 │                                              when an outside reporter must be credited)
 └─ in the cloud stack (bamlab/flashlight-cloud) ► private issue in bamlab/flashlight-cloud
```

## Private issue format

```bash
# CLI stack: bamlab/flashlight-internal · cloud stack: bamlab/flashlight-cloud
gh issue create -R bamlab/flashlight-internal \
  --title "security(<area>): <short description>" \
  --label "needs-triage" \
  --body-file <file>
```

**Critical findings** (severity `critical`) keep `needs-triage` and are also typed and prioritised, so nobody has to fill these in by hand:

```bash
gh issue edit <issue-url> --type Task
# then set the native Priority issue field to Urgent:
gh api graphql -f query='{ organization(login: "bamlab") { issueFields(first: 50) { nodes { ... on IssueFieldSingleSelect { id name options { id name } } } } } }'
gh api graphql -f query='mutation { setIssueFieldValue(input: { issueId: "<issue node id>", issueFields: [{ fieldId: "<Priority field id>", singleSelectOptionId: "<Urgent option id>" }] }) { clientMutationId } }'
```

Body:

- **Severity** — critical / high / medium / low (definitions in `/gdpr-audit`).
- **Kind** — secret · vulnerability · personal data · retention · consent.
- **Where** — repo and `file:line` (for public code, say `bamlab/flashlight` explicitly).
- **What happens** — what data or capability is exposed, to whom.
- **Fix** — the smallest change that closes it.
- **Found by** — the run, audit or session that found it.

Before creating, search for an existing open issue on the same `file:line` and comment there instead of filing a duplicate.

If you can't reach these private repos (outside contributor), don't file anything public: open a private security advisory at https://github.com/bamlab/flashlight/security/advisories/new, as `SECURITY.md` describes.
