---
title: Project layout
description: A map of the source tree for contributors.
group: Internals
order: 13
---

| Path | Purpose |
| ------------------------ | ---------------------------------------------- |
| `cmd/` | Entry points (`main.go` via `phi`: `phi run`, `phi update`, `phi sessions`, …) |
| `ext/` | Public extension API: `ext/go/pxb` protocol + `ext/go/phi` SDK (nested Go module `github.com/pulseaiclub/phi/ext/go`), the `ext/rust` crate, and the `ext/ts` TypeScript SDK |
| `internal/util/update/` | Self-update check + GitHub Releases install |
| `internal/agent/` | Agent engine, executor, jobs |
| `internal/agent/prompt/` | System prompt templates + Skills/MCP catalogs |
| `internal/components/` | TUI widgets (chat, input, palette, mention, diffview, codeview, …) |
| `internal/llm/` | LLM clients (OpenAI-compatible + Anthropic + Gemini), streaming, skills |
| `internal/llm/extmodel/` | Extension-served model connection adapted to `llm.ChatClient` |
| `internal/project/` | Workspace layout and config |
| `internal/project/model/` | Built-in model presets + request interceptors |
| `internal/session/` | Session persistence, load/apply |
| `internal/job/` | Sub-agent job manager (spawn/wait/cancel) |
| `internal/tools/` | Agent tools (`*tool` packages + `tooldef`) |
| `internal/toolmanager/` | External tool discovery/download |
| `internal/tui/editor/` | TUI root widget (`Editor`), layout, dispatch, branch watch |
| `internal/tui/transcript/` | Session→widget projection (Mapper, Pane) |
| `internal/tui/composer/` | Chat input, `/` `?` `@` `!` pickers, palette |
| `internal/tui/footer/` | Activity spinner, token labels, update hint |
| `internal/tui/overlays/` | Permission / ext-confirm / error panels |
| `internal/tui/diffpane/` | Git diff review overlay (`/diff`) |
| `internal/tui/codepane/` | Source viewer overlay (`/code`) |
| `internal/tui/submit/` | Submit, cancel, slash dispatch, bash runner |
| `internal/tui/commands/` | Slash/palette registry, session/extension commands |
| `internal/tui/pathutil/` | Cwd + git branch path labels |
| `internal/tui/controller/` | Engine lifecycle, Bus/Msg, activity |
| `internal/version/` | Build-time `Version` (splash / `phi update`) |
| `internal/util/` | Shared helpers (diff, retry, SSE, file search, …) |
| `internal/util/diffreview/` | Unified-diff parse/render, in-memory review notes, git load |
| `internal/permission/` | Permission policy and ask gate |
| `internal/extension/` | PXB extension host: runner + layers (`core`/`loader`/`install`/`create`) |
| `internal/mcp/` | MCP config + stdio/http client + pool (`mcp://` URL route) |

## Design docs

| Path | Purpose |
| ---- | ------- |
| [Extensions](/docs/extensions/) | Extensions: discover, API, events, migration from hooks |
| [MCP](/docs/mcp/) | MCP: zero schema pollution, `mcp://` URLs, config, CLI |
| [Supported models](https://github.com/pulseaiclub/phi/blob/main/doc/models.md) | Models: presets, explicit `api`, thinking config |
| [TUI architecture](/docs/tui-architecture/) | TUI: package layout, aggregation, interaction flows |
| [Session context building](https://github.com/pulseaiclub/phi/blob/main/doc/session-context-building.md) | Sessions: tree model, compaction, context building |
