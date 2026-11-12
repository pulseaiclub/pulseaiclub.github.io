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
| `readonly` | Deny writes and `ask`; policy-allowed bash still runs. |
| `autopilot` | Fold `ask` → deny (same as `headless-strict` today). |
| `headless-strict` | Fold `ask` → deny (used by `phi run`). |
| `allow-all` | Skip every permission check. |

`readonly` does not block every bash command: a command the underlying policy
allows (`bash.allow`, or `bash.default: allow`) still runs after the deny list
is checked. Writes, other `ask` decisions, and `agent_spawn` are denied.

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

`bash.default` / `bash.allow` / `bash.deny` match against the command. The
hard deny list also blocks piping into `sh` / `bash`. Global keys:
`workspace_only_writes` (default `true`) and `ask_timeout_sec`. The deprecated
`dangerously_allow_all: true` still loads as `mode: allow-all` and is dropped
on the next save; `phi run --yolo` maps to the same mode.

## Custom rules

`permissions.rules` adds your own rules by tool, kind, command, path, or
workspace scope:

```yaml
permissions:
  rules:
    - tool: "mcp__*"          # exact name or glob
      kind: read
      decision: ask
      reason: "external lookup: %s"

    - path:                   # filesystem prefixes, "~" is expanded on load
        - "~/.ssh"
      decision: deny

    - kind: exec
      command: "^git push"    # regex against the whole command
      decision: ask
      reason: "pushing needs a human"

    - kind: write
      scope: outside-workspace
      decision: deny
```

Rules are evaluated **strictest-first** (`deny` > `ask` > `allow`), so a rule
can tighten a policy but never loosen one. An allowlist entry only fires on a
single simple command — `^ls\b` does not license `ls && rm -rf …`. Paths are
resolved through symlinks before any rule sees them, so a link inside the
workspace cannot smuggle a write outside it. Full semantics:
[doc/permissions.md](https://github.com/pulseaiclub/phi/blob/main/doc/permissions.md).

Sub-agents run a child gate with `bash.default: allow` (the hard deny list still
applies), so spawned `explore` / `review` / `worker` jobs can run
non-allowlisted shell without folding Ask → Deny. See [Sub-agents](/docs/subagents/).

## TUI approval dialog

In the TUI, an approval dialog replaces the editor with options to approve,
deny with feedback, or allow all for the session / for every session. The
palette's settings → permissions entry toggles session-wide bypass.

> **Note:** extensions run with your full process permissions — the Gate
> protects tool execution, not the extension's own Go code.
