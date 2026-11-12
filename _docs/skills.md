---
title: Skills
description: Package reusable procedures as SKILL.md files loaded from ~/.phi/skills and the Agent Skills locations.
group: Extending
order: 8
---

Skills are directories containing a `SKILL.md` file with YAML frontmatter and
a Markdown body. They are loaded from `~/.phi/skills/` (or `skill_path` /
`PHI_SKILL_PATH`) and injected into the agent's context, letting you give the
model reusable procedures.

The Agent Skills locations `~/.agents/skills/` and `.agents/skills/` are read
too, so a skill pack installed for another agent works here without
configuration. Project `.agents/skills/` directories are discovered from the
working directory upward, stopping at the repository root when there is one.
Roots are searched in order — `skill_path` first, then `~/.agents/skills`,
then the project directories — and the first root wins when two of them define
the same skill name. A leading `~` in `skill_path` or `PHI_SKILL_PATH` expands
to your home directory.

> **Security:** skill files are workspace content, not trusted input — a
> project `.agents/skills/` is picked up without confirmation. Review skills
> the way you review `AGENTS.md` before trusting a checkout.

```markdown
---
name: My Skill
description: What this skill does
license: MIT
compatibility: claude, openai
disable-model-invocation: false
---

Instructions the agent should follow when this skill is relevant.
```

`disable-model-invocation: true` keeps a skill out of the system prompt
catalog — good for the ones you only want on explicit request. It stays in
the `/skill` list and is still applied when you pick it there. Only a
case-insensitive `true` counts; any other value means `false`. This is a
catalog filter, not access control: the model can still find the file with
`ls` / `find`.

In the TUI, type `/skill` and pick a row from the filterable list, then submit
the message with the selected skills applied.

The system prompt lists **skill names only** — like MCP server names — so
skills do not silently bloat every request.
