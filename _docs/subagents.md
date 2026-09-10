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
| `explore` | no write/edit; bash except hard denies | Multi-hop recon / map structure |
| `review` | same as explore | Diffs / checks; report only |
| `worker` | full tools except nesting; bash except hard denies | Scoped, self-contained edits |

Sub-agents run their own permission gate with bash defaulting to allow (the hard
deny list still applies, including piping into `sh` / `bash`), so `explore` /
`review` / `worker` can run non-allowlisted shell (`make`, pipelines, tests)
without an Ask → Deny fold.

Default stays `explore` (no edits). Prefer `worker` when the task is to
implement a scoped change in an isolated context.

Up to **4** sub-agents run concurrently; spawning more fails outright (no
queue), so `agent_wait` on a running job before launching another.

## Per-role models

Optionally pin a model per role, so cheap recon and strong implementation can
coexist in one session:

```yaml
agents:
  enabled: true
  models:                  # optional; omitted roles inherit the parent model
    explore: cheap-model
    review: strong-model
    worker: coding-model
```

Switch for the current session only via the palette: settings → agents → models
→ `explore` / `review` / `worker`. `(inherit parent)` clears the override. Like
settings → model, this is session-only and does not write `config.yaml`.

## Job artifacts

Sub-agent transcripts live under `~/.phi/jobs/<id>/` (meta, logs, `result.md`)
and are **not** injected into the parent context — only the wait/task summary
is. That keeps long explorations from burning the parent's context window.
