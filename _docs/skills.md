---
title: Skills
description: Package reusable procedures as SKILL.md files loaded from ~/.phi/skills.
group: Extending
order: 8
---

Skills are directories containing a `SKILL.md` file with YAML frontmatter and
a Markdown body. They are loaded from `~/.phi/skills/` (or `skill_path` /
`PHI_SKILL_PATH`) and injected into the agent's context, letting you give the
model reusable procedures:

```markdown
---
name: My Skill
description: What this skill does
license: MIT
compatibility: claude, openai
---

Instructions the agent should follow when this skill is relevant.
```

In the TUI, add skills from the palette (skills → list), then submit the
message with the selected skills applied.

The system prompt lists **skill names only** — like MCP server names — so
skills do not silently bloat every request.
