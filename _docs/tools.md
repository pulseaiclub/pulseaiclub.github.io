---
title: Tools
description: The built-in tools an agent can call, and how sub-agent jobs stay out of the parent context.
group: Reference
order: 11
---

Built-in tools the model can call (see `internal/tools/`):

| Tool | Purpose |
| -------------- | -------------------------------------------- |
| `bash` | Run a shell command in the working directory |
| `read` | Read a file |
| `write` | Write a file (gated by permissions) |
| `edit` | Targeted edit of a file |
| `grep` | Regex search across files |
| `find` | File patterns (fd) |
| `ls` | Directory listing |
| `agent_spawn` | Start an isolated sub-agent job (async) |
| `agent_wait` | Wait for a job; returns short summary only |
| `agent_list` | List jobs |
| `agent_cancel` | Cancel a running job |

Sub-agent transcripts live under `~/.phi/jobs/<id>/` and are **not** injected
into the parent context — only the wait/task summary is.

Fast search tools (`fd`, `ripgrep`) are downloaded on first startup into
`~/.phi/bin` when missing.
