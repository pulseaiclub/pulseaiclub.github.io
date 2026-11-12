---
title: Headless mode
description: Run one agent loop without a TUI — flags, exit codes, and permission behavior for phi run.
group: Using phi
order: 5
---

```sh
phi run -p "fix the failing test in internal/tools"
```

Runs one agent loop without a TUI. Human logs go to stderr; with `--jsonl`,
machine-readable events go to stdout, one JSON object per line.

## Flags

| Flag | Description |
| -------------------- | ---------------------------------------------- |
| `-p, --prompt STRING` | Prompt to run (required) |
| `--jsonl` | Emit JSONL events to stdout |
| `--yolo` | Skip all permission checks for this run (benchmarks / CI only) |
| `--timeout DURATION` | Limit the agent run wall-clock time (e.g. `10m`; disabled by default) |
| `--session ID` | Resume a persisted session by id or unique prefix |
| `--continue-last` | Resume the newest persisted session for this directory |
| `--session-dir DIR` | Override the session storage directory |
| `--tools LIST` | Enable only these comma-separated built-in tools |

`--tools` accepts built-in names such as `read,ls,grep`. MCP and agent tools
still append when configured; the flag only scopes the built-in toolset.

## Exit codes

| Code | Meaning |
| ---: | --- |
| `0` | Success |
| `1` | Runtime / LLM error (any loop error) |
| `3` | Config / usage error |

## Permissions

In headless mode, permission `ask` decisions are denied (there is no approval
UI): unless `permissions.mode` is set, `phi run` uses `headless-strict`. This
is not `readonly` — anything the policy already allows still runs, including
writes inside the workspace and allowlisted bash. For benchmarks that need
arbitrary shell (`pytest`, `npm test`, …), pass `--yolo` to skip the
permission gate for that run only.
