---
title: Configuration
description: config.yaml reference, environment overrides, provider routing, and the ~/.phi workspace layout.
group: Get started
order: 2
---

phi reads `~/.phi/config.yaml` (standard YAML). Environment variables override
it for one-off runs. `phi config` opens an HTML editor for the same file in
your browser.

![phi config editor](/assets/img/config.png)

```yaml
# ~/.phi/config.yaml
models:
  - name: gpt-4o            # model name; "claude-*" routes to the Anthropic API
    api_key: sk-...         # or set PHI_API_KEY
    base_url: https://api.openai.com/v1   # default; PHI_BASE_URL overrides
    context_window: 128000  # optional
    default: true           # the model used at startup; first entry wins if absent
  - name: claude-sonnet-4-20250514   # extra models; switchable at runtime
    api_key: sk-ant-...
    base_url: https://api.anthropic.com
    context_window: 200000

skill_path: ~/.phi/skills # where SKILL.md files are loaded from

agents:
  enabled: true           # default; set false to disable agent_* sub-agent tools

permissions:
  mode: interactive       # interactive | readonly | autopilot | headless-strict
  bash:
    default: ask          # ask | allow | deny
    allow:
      - "go test ./..."
    deny:
      - "rm -rf *"
```

## Environment overrides

| Variable | Overrides |
| ---------------- | ------------------ |
| `PHI_API_KEY`    | `models[].api_key` (default model) |
| `PHI_MODEL`      | `models[].name` (default model) |
| `PHI_BASE_URL`   | `models[].base_url` (default model) |
| `PHI_SKILL_PATH` | `skill_path`       |

Provider routing: a base URL containing `anthropic` or a model name starting
with `claude` uses the Anthropic Messages API; everything else uses the
OpenAI-compatible `/chat/completions` path.

## Recommended model: DeepSeek Flash

phi + DeepSeek Flash — the best pairing: grounded, low hallucination, cache hit
rates near 100%.

Measured data — 39 LLM rounds, same session: prompt **16k→40k**, hit rate
**95–100%** (avg **98.7%**).

| Round | Prompt tokens | Cached tokens | Cache hit |
| ---: | ---: | ---: | ---: |
| 1 | 16,176 | 15,872 | **98.1%** |
| 10 | 20,163 | 20,096 | **99.7%** |
| 20 | 27,604 | 26,624 | **96.4%** |
| 30 | 35,245 | 35,072 | **99.5%** |
| 39 | 39,794 | 39,552 | **99.4%** |

## Workspace layout

```
~/.phi/
├── config.yaml   # global configuration
├── bin/          # downloaded search tools (fd, ripgrep)
├── skills/       # SKILL.md skill directories
├── extensions/   # <name>/phi.yaml + compiled exec binaries
├── jobs/         # sub-agent job artifacts (meta, logs, result.md)
└── session/      # persisted sessions, one dir per working directory
    └── <encoded-cwd>/
```
