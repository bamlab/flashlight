---
name: gdpr-audit
description: Audit the codebase for GDPR and secret-handling problems — personal data in logs, in third-party payloads (Sentry, Slack, Discord, AWS), in fixtures, committed secrets, retention. Use when asked for a GDPR/RGPD/privacy audit, before a release touching user data, or by the factory's weekly run.
---

# GDPR audit

Find places where personal data or secrets leak, and report them privately. Read `.claude/rules/privacy-and-security.md` first: it defines personal data and where findings may be written.

## Scope

Run on the current repo. In `bamlab/flashlight-cloud`, include `flashlight-open-source/` (the public submodule).

## Checks

Work through each check. For each hit, record `file:line`, what personal data or secret is involved, where it goes, and a severity.

1. **Secrets in git.** Run `gitleaks git . --no-banner --redact --report-format json --report-path /tmp/gitleaks.json` and `gitleaks dir . --no-banner --redact`. Read results with the repo's `.gitleaks.toml` in mind. Transcrypt-encrypted files (`git check-attr filter <file>` says `crypt`) are encrypted in git: a hit on them only means your local checkout can decrypt them — not a leak. Never print secret values.
2. **Personal data in logs.** Search logger and console calls whose arguments include `email`, `user`, `name`, `ip`, whole request/response bodies, or whole entity objects (`Logger.*(`, `console.*(`, `morgan`, `morganBody`). Include ops scripts.
3. **Third-party payloads.** For each outbound integration (Sentry `init`/`captureException`/`setUser`/`beforeSend`, Slack, Discord, email, AWS Device Farm specs, analytics events), list which personal fields are sent and whether they're needed.
4. **Fixtures and test data.** Look for real emails, real device dumps, signed URLs (`X-Amz-Signature`), tokens, phone numbers in `__tests__`, `fixtures`, `*.json`, `*.txt`.
5. **Copies of production data.** Scripts or runbooks that copy prod data elsewhere (staging, local disk) without anonymisation.
6. **Retention and deletion.** Is there a way to delete a user's data (runs, uploads, videos, auth user)? Are uploads/videos ever expired?
7. **Consent and analytics.** Analytics is cookieless (Plausible) and consent tooling is loaded where needed; no personal data in analytics event params.

## Severity

- **critical** — a live secret exposed, or personal data publicly readable.
- **high** — personal data sent to a third party or log store without need, or no way to delete user data.
- **medium** — personal data in internal logs/notifications, or real personal data in fixtures.
- **low** — hygiene (missing scrubbing on a path that currently carries no personal data).

## Output

1. A table: severity · check · `file:line` · finding · suggested fix.
2. Route every finding with `/security-findings` — never into a public issue.
3. Don't fix anything in the same run unless asked: an audit reports.
