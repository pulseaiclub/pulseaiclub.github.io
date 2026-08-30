---
title: Permissions
description: Gate or Ask before destructive tools fire — modes, per-tool rules, and the TUI approval dialog.
group: Using phi
order: 6
---

Tool execution is gated by a permission policy, so the agent can run read-only
by default and ask before anything destructive. Configure it under
`permissions:` in `~/.phi/config.yaml`.

## Modes

| Mode | Behavior |
| ------------------ | --------------------------------------------------- |
| `interactive` | Default. `ask` decisions prompt in the TUI. |
| `readonly` | Deny writes / bash; read tools still work. |
| `autopilot` | Fold `ask` → allow, run unattended. |
| `headless-strict` | Fold `ask` → deny (used by `phi run`). |

## Per-tool rules

```yaml
permissions:
  mode: interactive
  bash:
    default: ask          # ask | allow | deny
    allow:
      - "go test ./..."
    deny:
      - "rm -rf *"
```

`bash.default` / `bash.allow` / `bash.deny` use exact command prefix matching.
Global keys:

- `workspace_only_writes` (default `true`)
- `ask_timeout_sec`
- `dangerously_allow_all` (default `false`)

## TUI approval dialog

In the TUI, an approval dialog replaces the editor with options to approve,
deny with feedback, or allow all for the session / for every session. The
palette's settings → permissions entry toggles session-wide bypass.

> **Note:** extensions run with your full process permissions — the Gate
> protects tool execution, not the extension's own Go code.
