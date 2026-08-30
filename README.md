# pulseaiclub.github.io

Source for the [PulseAI Club](https://pulseaiclub.github.io/) organization
site — currently the documentation site for
[phi](https://github.com/pulseaiclub/phi), a minimal terminal coding agent
harness in Go.

Built with **Jekyll** and rendered by GitHub Pages from the `main` branch
(no build step, no Actions needed — edit Markdown, push, done).

## Structure

```
├── index.md            # landing page
├── _docs/              # documentation pages (Markdown + YAML frontmatter)
├── _layouts/           # page layouts (home, docs, default)
├── _includes/          # header, sidebar, footer, prev/next nav
└── assets/
    ├── css/main.scss   # full design system (two themes, dark default)
    ├── js/main.js      # theme toggle, TOC, copy buttons, mobile nav
    ├── fonts/          # self-hosted IBM Plex Sans / Mono (Latin)
    └── img/            # screenshots + logo copied from the phi repo
```

## Writing docs

Each page in `_docs/` starts with frontmatter:

```yaml
---
title: Getting started
description: One-line summary shown under the heading.
group: Get started        # sidebar group (see doc_groups in _config.yml)
order: 1                  # position inside the group
---
```

Everything else is plain Markdown (GFM). Code fences get syntax highlighting
and a copy button automatically. `> ... {: .note }` renders a callout box.

To keep docs in sync with the phi repo, edit `_docs/*.md` here and update the
matching section of the [phi README](https://github.com/pulseaiclub/phi) if
the change is user-facing. Screenshots in `assets/img/` are copies of
`phi/assets/` — refresh them when the UI changes.

## Local development

```sh
gem install jekyll -v 3.9
jekyll serve            # http://localhost:4000
```

The build runs the same Jekyll 3.9 line that GitHub Pages uses for branch
deploys, so what you see locally is what ships.
