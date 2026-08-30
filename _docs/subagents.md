---
title: Sub-agents
description: Spawn isolated jobs for exploration, review, and scoped edits without polluting the parent context.
group: Using phi
order: 7
---

Sub-agent tools (`agent_spawn`, `agent_wait`, …) are **on by default**. To
keep a session lean, disable them in `~/.phi/config.yaml`:

```yaml
agents:
  enabled: false
```

Or toggle for the current session via the palette: settings → agents.
When disabled, those tools are not registered and the model cannot spawn jobs.

## Roles

Sub-agents use a **role** that scopes their tools:

| Role | Tools | Use for |
|------|--------|---------|
| `explore` | read-only (+ allowlisted bash) | Search / map structure |
| `review` | read-only (+ allowlisted bash) | Diffs / checks; no edits |
| `worker` | full tools except nesting | Planned, independent edits |

Default stays `explore` (read-only). Prefer `worker` only after the parent has
a concrete plan.

## Job artifacts

Sub-agent transcripts live under `~/.phi/jobs/<id>/` (meta, logs, `result.md`)
and are **not** injected into the parent context — only the wait/task summary
is. That keeps long explorations from burning the parent's context window.
