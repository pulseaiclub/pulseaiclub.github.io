---
title: Sessions
description: Sessions persist automatically per working directory and can be listed, resumed, forked, or deleted.
group: Using phi
order: 4
---

Sessions persist automatically per working directory under
`~/.phi/session/<encoded-cwd>/` as JSONL trajectories.

- `phi sessions` — list session id, mtime, and preview for the current directory
- `/sessions` in the TUI — opens a filterable session picker (Enter resumes;
  `Ctrl+X` then `Y` deletes the highlighted session); listings show a fork's
  source as `↳ <id>`
- `/new` — start a fresh session (new id, empty transcript)
- `/fork` — copy the current session at its current point into a new session
  (new id, same conversation) and switch to it; the source keeps running
  untouched
- `phi sessions fork <id>` — copy a session at its current point and print the
  new id; continue it headlessly with `phi run --session <new-id>`
- `phi sessions remove <id>` — delete a persisted session (alias `rm`; an id
  prefix works when unique)
- `phi run --session <id>` / `phi run --continue-last` — resume headlessly
  (`--session` accepts an id or a unique prefix)

Each session remembers the model it was using: resuming restores that
session's model, and a new session inherits the most recently selected one.

## Headless resume

```sh
phi run --session <id> -p "keep going"
phi run --continue-last -p "same session as last time"
```

Resuming replays tool executions (with their styled rows) instead of dropping
them, so a continued conversation stays coherent.
