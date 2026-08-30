---
title: Sessions
description: Sessions persist automatically per working directory and can be listed, resumed, or cleared.
group: Using phi
order: 4
---

Sessions persist automatically per working directory under
`~/.phi/session/<encoded-cwd>/` as JSONL trajectories.

- `phi sessions list` — list session id, mtime, and preview for the current directory
- `/sessions` in the TUI — same, in-app
- `/resume <id>` — continue a session (id or unique prefix)
- `/clear` — start a fresh session (new id, empty transcript)
- `phi run --session <id>` / `phi run --continue-last` — resume headlessly

## Headless resume

```sh
phi run --session <id> -p "keep going"
phi run --continue-last -p "same session as last time"
```

Resuming replays tool executions (with their styled rows) instead of dropping
them, so a continued conversation stays coherent.
