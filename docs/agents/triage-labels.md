# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                          |
| -------------------------- | -------------------- | ------------------------------------------------ |
| `needs-triage`             | `Status:Unconfirmed` | Maintainer needs to evaluate this issue          |
| `needs-info`               | `needs details`      | Waiting on reporter for more information         |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified; the AI factory may implement it |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation                    |
| `wontfix`                  | `wontfix`            | Will not be actioned                             |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Other status labels already used in this repo:

- `Status:Confirmed` — the bug is reproduced. Keep it alongside `ready-for-agent` / `ready-for-human`.
- `Status:Check Result` — waiting for the reporter to check a fix.
- `Status:Stale` — no activity; candidate for closing.

Only a maintainer (or an org member's own issue) may apply `ready-for-agent`: it is what lets an agent start implementing.
