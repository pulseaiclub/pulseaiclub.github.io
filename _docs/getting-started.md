---
title: Getting started
description: Install phi, pick a model, and run your first agent loop in the terminal.
group: Get started
order: 1
---

phi is a minimal terminal coding agent harness in Go — a sibling to Pi. It gives
the model a small set of tools (`read`, `write`, `edit`, `bash`, …) behind a
permission gate, keeps sub-agent work out of the parent context, and never lets
MCP schemas pollute the prompt.

## Install

### macOS / Linux

```sh
curl -fsSL https://raw.githubusercontent.com/pulseaiclub/phi/main/scripts/install.sh | bash
```

### Windows (PowerShell 5.1+)

```powershell
irm https://raw.githubusercontent.com/pulseaiclub/phi/main/scripts/install.ps1 | iex
```

### From source

Requires Go 1.26.3+ (see `go.mod`):

```sh
git clone git@github.com:pulseaiclub/phi.git
cd phi
make build          # produces ./phi
make install        # build and install into $GOBIN
```

## Pick a model

First launch needs a model. Open the config editor — this creates the `~/.phi`
layout and writes `~/.phi/config.yaml`:

```sh
phi config
```

Or set environment variables for a one-off run:

```sh
export PHI_MODEL=gpt-4o
export PHI_API_KEY=sk-...
```

## Run it

```sh
phi
```

On first start, phi automatically creates `~/.phi/{bin,skills,hooks,session}`.
Search tools (`fd`, `rg`) download into `~/.phi/bin` in the background when
missing.

The TUI gives the model four core tools — `read`, `write`, `edit`, and
`bash` — plus `grep`, `find`, and `ls`. The model uses these to fulfill your
requests. External HTTP fetch is available via [MCP](/docs/mcp/) when
configured.

> **Note:** a newer release available hint appears in the footer as
> `0.2.0 available · phi update`. Run `phi update` to install it.

## Footprint

phi aims to stay cheap to run and cheap to hack on. Numbers below are for a
stripped release build (`CGO_ENABLED=0`, `-ldflags="-s -w"`), measured on
macOS arm64 unless noted.

| Metric | phi |
| --- | ---: |
| Release binary | **~12 MB** |
| Idle RSS (1 session) | **~21 MB** |
| 10 idle sessions (total RSS) | **~196 MB** (~20 MB each) |
| Time to first frame | **~40 ms** (27–65 ms) |
| Cold `go build` (empty `GOCACHE`) | **~5.5 s** |
| Warm rebuild | **~0.7 s** |
| Go source (excl. tests) | **~22k LOC** / 107 files |
| Go packages | **32** |
| Direct module deps | **6** (15 modules total) |
| Linked runtimes | system libs only (no Node / Electron / Python) |

## Next steps

- [Configuration](/docs/configuration/) — `config.yaml`, environment overrides, workspace layout
- [TUI](/docs/tui/) — editor features, keyboard shortcuts, commands
- [Headless mode](/docs/headless/) — `phi run -p "…"` for one-shot agent runs
- [MCP](/docs/mcp/) — wire up external tools without context death
