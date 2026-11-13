# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                          |
| -------------------------- | -------------------- | ------------------------------------------------ |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue          |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information         |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified; the AI factory may implement it |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation                    |
| `wontfix`                  | `wontfix`            | Will not be actioned                             |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

## Other labels

The same label set is used in `bamlab/flashlight`, `bamlab/flashlight-cloud` and `bamlab/flashlight-internal`.

- **Scope** (one per issue): `Package:CLI`, `Package:Front-End`, `Package:Cloud`.
- **Bug status**: `Status:Unconfirmed` (reported, not reproduced yet) → `Status:Confirmed` (reproduced) → `Status:Check Result` (fix released, waiting for the reporter to check). `Status:Stale`: no activity, candidate for closing. Keep the status label alongside `ready-for-agent` / `ready-for-human`.
- **Type**: `bug`, `enhancement`, `documentation`, `support` (a dependency or external library version isn't supported), `question`, `duplicate`, `invalid`.
- **Priority and effort**: use the native GitHub issue fields `Priority` (Urgent / High / Medium / Low) and `Effort` (High / Medium / Low), not labels. With `gh`, set them through the GraphQL `setIssueFieldValue` mutation.
- **Contributors**: `help wanted`, `good first issue`.
