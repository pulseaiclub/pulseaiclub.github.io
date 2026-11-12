---
title: Extensions
description: Extend phi with native binaries — Go, Rust, and TypeScript SDKs, tools, models, slash commands, and lifecycle event handlers via the PXB protocol.
group: Extending
order: 9
---

Extensions are **native binaries** that speak the **Phi eXtension Binary (PXB)**
protocol over stdin/stdout. They replace the former yaegi-interpreted `.go`
sources.

> **Security:** Extension processes inherit your permissions. Only install from
> sources you trust.

## Full event chain

Shaped for subprocess PXB:

```
user_input ──(transform|handled)──► before_agent_start ──► agent_start
  └─ turn_start → LLM → tool_execution_start → tool_call → Gate/Ask → Run
       → tool_result → tool_execution_end → turn_end
  └─ (no tools) agent_end
session_before_switch → session_shutdown → session_start
session_compact (after auto compaction)
```

| Event | Mode | Can |
|-------|------|-----|
| `user_input` | intercept | rewrite text / `Handled` swallow |
| `before_agent_start` | intercept | rewrite prompt / append context |
| `tool_call` | intercept | block / rewrite args / context |
| `tool_result` | intercept | rewrite content / context / **Stop** agent loop |
| `session_before_switch` | intercept | cancel switch |
| `session_*` / `agent_*` / `turn_*` / `tool_execution_*` / `session_compact` | subscribe | observe (payload via `SubscribeEvent`) |

Tool loop order remains **ExtensionPre → Gate/Ask → Run → ExtensionPost**.

Session lifecycle events carry a free-form `reason`. Current values:
`session_start`: `startup`, `new`, `resume`, `fork`; `session_before_switch`:
`new`, `resume`, `fork`; `session_shutdown`: `new`, `resume`, `fork`, `quit`.
A fork allocates its id only after approval, so its `session_before_switch`
carries an empty target; the id first appears on `session_shutdown`. Handlers
that branch on `reason` should treat an unknown value as "a normal session
switch".

## Why not JSON lines?

PXB uses a fixed 16-byte little-endian header (`PXB\x01` + type + flags + id +
length) and **tagged-field** payloads (`tag u16 | kind u8 | value`). Decoders
skip unknown tags; new events are new `Ev*` codes; new frame types are skipped
by `payload_len`. See the `ext/go/pxb` package doc for the full evolution rules.

On Apple Silicon (release), Hello encode+decode is ~0.11–0.12 µs for Go and Rust
PXB vs ~1.2 µs for a comparable JSON-lines object:

| Implementation | Hello encode+decode | Frame write+read (in-memory) | Allocs |
| --- | ---: | ---: | ---: |
| Rust PXB (`phi-ext`) | ~0.12 µs | ~0.06 µs | — |
| Go PXB (`ext/go/pxb`) | ~0.11 µs | ~0.05 µs | 3 / op |
| Go JSON lines | ~1.2 µs | — | 15 / op |

Re-probe with `cargo run --release --example bench` under `ext/rust`.

## Layout

| Location | Scope |
|----------|-------|
| `~/.phi/extensions/<name>/phi.yaml` | Global |
| `<cwd>/.phi/extensions/<name>/phi.yaml` | Project-local |

Same name: project wins. Disable all with `PHI_EXTENSIONS=off`.

### `phi.yaml`

```yaml
name: hello
version: "0.1.0"
exec: ./hello          # relative to this directory
description: optional
enabled: true          # optional, default true
```

## Authoring (Go SDK)

Lightweight module (no TUI deps):

```bash
go get github.com/pulseaiclub/phi/ext/go@v0.21.0
```

Slow tools (HTTP fetch, long builds, …) should set `TimeoutSec` — the host's
default RPC wait is **30s**. Values are clamped to 1–3600.

Cancellation or timeout of an in-flight RPC terminates the extension process,
including its other pending calls. Reload the extension before using it again.
This is process-level cancellation, not a cooperative cancellation signal to
individual handlers.

PXB limits each encoded payload to **16 MiB** by default. Extensions that
advertise `CapLargeFrames` in the hello handshake can receive `ModelInvoke`
frames up to 256 MiB, so long sessions fit an ext-served model request.
Oversized tool results still return an explicit error; keep large output in a
file and return a concise summary and path.

Set `DetailFromArgs` so the TUI tool row shows a one-line summary (path, URL, …)
instead of raw JSON while the tool is in progress. The host RPCs the extension
with a short default timeout (not `TimeoutSec`).

Set `Expanded: true` on `ToolResult` when the tool body should start open in the
TUI (e.g. a plan). The user can still collapse it; toggle state wins after that.

Set `Readable: true` on side-effect-free tools (read-only lookups, pure
computation) so the host may run a batch of all-readable calls concurrently.

```go
m.RegisterTool(ext.Tool{
	Name:        "fetch",
	Description: "HTTP GET",
	TimeoutSec:  120, // host waits up to 2m for this tool
	Parameters:  map[string]any{"type": "object", /* … */},
	DetailFromArgs: func(input json.RawMessage) string {
		var in struct {
			URL string `json:"url"`
		}
		_ = json.Unmarshal(input, &in)
		return in.URL // TUI row shows this instead of raw JSON
	},
	Execute: func(ctx context.Context, args json.RawMessage) (ext.ToolResult, error) {
		// …
		return ext.ToolResult{}, nil
	},
})
```

```go
package main

import (
	"github.com/pulseaiclub/phi/ext/go"
	"github.com/pulseaiclub/phi/ext/go/phi"
)

func main() {
	m := phi.New("hello", "0.1.0")
	m.RegisterCommand("hello", ext.Command{
		Description: "Say hi",
		Handler: func(args string, ctx *ext.Context) error {
			m.Notify("info", "Hello!")
			// m.Submit("follow-up") // after /hello returns
			// m.SendUserMessage("…") // enqueue a turn anytime
			return nil
		},
	})
	// NeedsArgs: picker accept / bare "/plan" leaves "/plan " in the composer.
	m.RegisterCommand("plan", ext.Command{
		Description: "Enter/exit plan mode — /plan on|off|status",
		NeedsArgs:   true,
		Handler: func(args string, ctx *ext.Context) error {
			_ = args
			return nil
		},
	})
	m.OnUserInput(func(ev ext.UserInputEvent) *ext.UserInputResult {
		// return &ext.UserInputResult{Handled: true} to swallow
		// return &ext.UserInputResult{Text: "rewritten"} to transform
		return nil
	})
	m.OnToolCall(func(ev ext.ToolCallEvent) *ext.ToolCallResult {
		// return &ext.ToolCallResult{Block: true, Reason: "..."} to deny
		return nil
	})
	m.OnToolResult(func(ev ext.ToolResultEvent) *ext.ToolResultResult {
		// return &ext.ToolResultResult{Stop: true} to end the agent loop
		return nil
	})
	m.SubscribeEvent(ext.EventSessionStart, func(ev pxb.EventNotify) {
		_ = ev // Reason, PreviousSessionID, …
	})
	_ = m.Run()
}
```

Requires `import "github.com/pulseaiclub/phi/ext/go/pxb"` for `SubscribeEvent` payloads.

UI surface today: **toast** (`Notify`), **footer status** (`SetStatus`), **Submit** / **SendUserMessage**,
**Confirm** / **ConfirmOpts**.

```go
ok := m.ConfirmOpts(ext.ConfirmRequest{
	Title: "Delete?", Message: "Remove /tmp/x", Yes: "Delete", No: "Cancel", Danger: true,
}).OK
```

Build and install:

```bash
go build -o hello .
mkdir -p ~/.phi/extensions/hello
cp hello phi.yaml ~/.phi/extensions/hello/
```

Reload: **Ctrl+K → extensions → reload**.

## Authoring (Rust SDK)

Lean crate under `ext/rust` — same wire protocol, byte-for-byte compatible with
the Go SDK (golden-tested against the Go fixtures). Deps: `serde`/`serde_json`
at the JSON edges plus `tokio` (`rt` feature) to drive async tool handlers.
Requires Rust ≥ 1.75.

```bash
# pre-release: tracks the latest main (crate publishes under ext/rust/vX.Y.Z tags)
cargo add phi-ext --git https://github.com/pulseaiclub/phi --branch main
# release: published crate version
# cargo add phi-ext
```

```rust
use phi_ext::{phi, pxb};

fn main() -> Result<(), phi::Error> {
    let mut m = phi::Extension::new("hello", "0.1.0");
    m.register_command(
        "hello",
        phi::Command::new("Say hi", |_args, ctx| {
            ctx.notify("info", "Hello!");
            // ctx.submit("follow-up"); // after /hello returns
            // ctx.send_user_message("…"); // enqueue a turn anytime
            Ok(())
        }),
    );
    // needs_args: picker accept / bare "/plan" leaves "/plan " in the composer.
    m.register_command(
        "plan",
        phi::Command::new("Enter/exit plan mode — /plan on|off|status", |args, _ctx| {
            let _ = args;
            Ok(())
        })
        .needs_args(),
    );
    m.on_user_input(|_ev| {
        // Some(phi::UserInputResult { handled: true, ..Default::default() }) swallows
        // Some(phi::UserInputResult { text: Some("rewritten".into()), ..Default::default() }) transforms
        None
    });
    m.on_tool_call(|_ev| {
        // Some(phi::ToolCallResult { block: true, reason: "…".into(), ..Default::default() }) denies
        None
    });
    m.on_tool_result(|_ev| {
        // Some(phi::ToolResultResult { stop: true, ..Default::default() }) ends the agent loop
        None
    });
    m.subscribe(pxb::Event::SessionStart, |_ev| {});
    m.run()
}
```

Slow tools should chain `.timeout_sec(n)` (host default RPC wait is 30s; clamped
to 1–3600). Chain `.detail_from_args(|args| …)` so the TUI shows a one-line
summary instead of raw JSON, and `.readable()` on side-effect-free tools so the
host may run a batch of all-readable calls concurrently:

```rust
m.register_tool(
    phi::Tool::new("fetch", "HTTP GET", phi::Schema::object(), |_args| {
        Ok(phi::ToolResult { content: "…".into(), ..Default::default() })
    })
    .timeout_sec(120)
    .detail_from_args(|args| String::from_utf8_lossy(args).into_owned()),
);
```

Tools are usually IO-bound, so handlers may be async — `Tool::new_async` takes
an async closure that the SDK runs on a single-threaded tokio runtime:

```rust
m.register_tool(phi::Tool::new_async(
    "fetch",
    "HTTP GET",
    phi::Schema::object().property("url", phi::Schema::string()),
    |args| async move {
        // args is owned (Vec<u8>); network / IO calls go here.
        Ok(phi::ToolResult { content: "…".into(), ..Default::default() })
    },
));
```

Sync `Tool::new` handlers keep working unchanged.

UI surface today: **toast** (`ctx.notify`), **footer status** (`ctx.set_status`),
**Submit** (`ctx.submit`), **SendUserMessage** (`ctx.send_user_message`),
**Confirm / ConfirmOpts** (`ctx.confirm` / `ctx.confirm_opts`).

```rust
let reply = ctx.confirm_opts(phi::ConfirmRequest {
    title: "Delete?".into(), message: "Remove /tmp/x".into(),
    yes: "Delete".into(), no: "Cancel".into(), danger: true,
    ..Default::default()
});
```

Build and install (see `ext/rust/examples/` for runnable extensions):

```bash
cd ext/rust
cargo build --release --example hello
mkdir -p ~/.phi/extensions/hello
cp target/release/examples/hello phi.yaml ~/.phi/extensions/hello/
```

Reload: **Ctrl+K → extensions → reload**.

## Authoring (TypeScript SDK)

Zero-dependency package under `ext/ts` (`@pulseaiclub/phi-ext`) — same wire
protocol, same features; `Extension` / `Tool` / `Command` / `Context` /
`Schema` mirror the Rust SDK.

```ts
import { Extension } from "@pulseaiclub/phi-ext";

const m = new Extension("hello", "0.1.0");
m.registerCommand("hello", {
  description: "Say hi",
  handler: async (_args, ctx) => {
    await ctx.notify("info", "Hello!");
  },
});
await m.run();
```

The manifest points at Node; sources run directly on Node ≥ 23.6 (type
stripping), or ship a `dist/` build for older runtimes (Node ≥ 20):

```yaml
name: hello
exec: node
args: [dist/hello.js]
```

```bash
cd ext/ts
npm install && npm run build
mkdir -p ~/.phi/extensions/hello
cp -r dist phi.yaml ~/.phi/extensions/hello/
```

## Models from extensions

Extensions can register models the host can switch to — `/model`, the startup
palette, sub-agent role models and `agents.models` all accept them. Two
connection methods on `RegisterModel.Conn`:

- **Direct-connect** (`Conn: ""`) — the host dials `BaseURL` itself with the
  given `api`/`api_key`, exactly like a `models[]` entry in config.yaml.
- **Extension-served** (`Conn: ext.ConnExt`) — the extension *is* the
  connection: each chat completion arrives as a `ModelInvoke` frame, the
  handler streams deltas back as `ModelStreamEvent` frames, and the host
  assembles the final assistant message.

```go
m.RegisterModel(ext.Model{
	Name: "corp-proxy", Conn: ext.ConnExt,
	ContextWindow: 272000, ImageEnabled: true, ThinkEnabled: true,
	Stream: func(ctx context.Context, req ext.ModelRequest, emit func(ext.ModelEvent) error) error {
		return emit(ext.ModelEvent{
			Content: "hello from " + req.Model,
			Usage:   &ext.Usage{PromptTokens: 1, CompletionTokens: 3, TotalTokens: 4},
		})
	},
})
```

Contract notes:

- **Deltas only.** Emit content / reasoning / tool-call fragments — never the
  accumulated text. The host assembles the final message and attaches the
  last `Usage` seen for context-window accounting.
- **Cancellation is cooperative.** On Esc the host abandons the stream and
  sends a best-effort `ModelCancel`; respect `ctx` (Go) / `AbortSignal` (TS)
  when forwarding upstream.
- **Precedence.** Extension model names shadow config.yaml entries with the
  same name, and the first extension to register a name wins. Direct-connect
  registrations need `base_url`.
- The `/model` palette snapshots names at startup; after installing or
  reloading a model extension, `/model <name>` works immediately, the palette
  catches up on the next start.
- Go, Rust and TS SDKs all expose model registration (`m.RegisterModel`,
  `phi::Model::direct` / `Model::served`, `conn: CONN_EXT` + a `stream`
  handler).

## Install from GitHub

```bash
phi plugin install alice/greet
phi plugin install alice/greet@v1.2.3
```

Install prefers a **GitHub Release** asset for the current OS/arch (same naming
as `phi update`):

```text
{repo}_{version}_{goos}_{goarch}.tar.gz   # .zip on Windows
```

Example: `greet_1.2.3_darwin_arm64.tar.gz`. The archive must contain `phi.yaml`
and the compiled `exec` binary (optionally nested one directory deep). If a
`checksums_{version}.txt` asset is present, SHA-256 is verified.

When no matching release asset exists, install falls back to a shallow
`git clone` — the cloned tree must already include the binary (source-only repos
will fail). Source-only yaegi repos no longer load.

### Managing installed plugins

```bash
phi plugin list                  # installed plugins: id, version, source, path
phi plugin update                # update all managed plugins
phi plugin update greet          # update one plugin
phi plugin update greet@latest   # switch to the newest release
phi plugin update --check        # report available updates without installing
phi plugin remove greet          # uninstall (alias: rm)
```

Install records the GitHub source in `.phi-install.json` inside the extension
directory. `update` re-resolves that source and swaps the directory atomically
(the old tree is kept as a backup until the swap completes); release archives
are preferred, with the same git-clone fallback as install. A pinned ref
(`@v1.2.3`) stays pinned — override it with `phi plugin update greet@latest`
or another tag.

Extensions not installed via `phi plugin install` (manual copies) carry no
metadata and are left untouched by `update`/`remove`; reinstall once to bring
them under management.

## Lifecycle (process)

1. Discover `phi.yaml`
2. Spawn `exec` (stderr → `~/.phi/logs/ext-<name>.log`)
3. Ext → `Hello` · Host → `HelloAck`
4. Ext → `Register*` / `Subscribe` · Ext → `Ready`
5. Runtime RPC (`CommandInvoked`, `ToolInvoke`, `Intercept`, `Event`, `HostRequest`, `SessionMeta`)
6. Host → `Shutdown` · Ext → `ShutdownAck` (then SIGKILL if needed)

## Packages

| Path | Role |
|------|------|
| `ext/go/` (module `github.com/pulseaiclub/phi/ext/go`) | Shared types (`Tool`, events) |
| `ext/go/pxb` | Binary wire protocol |
| `ext/go/phi` | Go author SDK (`ExtensionAPI.Run`) |
| `ext/rust` (crate `phi-ext`) | Rust author SDK (`pxb` + `phi` modules; deps: serde/serde_json + tokio `rt`) |
| `ext/ts` (npm `@pulseaiclub/phi-ext`) | TypeScript author SDK (`pxb` + `phi` modules; zero runtime deps, Node ≥ 20) |
| `internal/extension` | Host side: discover, spawn, Runner shims (`core`/`loader`/`install`/`create` layers) |

## Migration from yaegi

| Old | New |
|-----|-----|
| `func Extension(phi *ext.API)` in `.go` | `phi.New` + `m.Run()` binary |
| Drop file under `extensions/` | Directory + `phi.yaml` + binary |
| `phi.On(ext.EventToolCall, …)` | `m.OnToolCall(…)` |

## Migration from shell hooks

| Old hook | Extension |
|----------|-----------|
| PreToolUse deny | `OnToolCall` → `Block: true` |
| PostToolUse context | `OnToolResult` → `Context` |
| Stop | `OnToolResult{Stop}` |
| UserPromptSubmit | `OnUserInput` |
| Command slash | `RegisterCommand` |
