---
title: Interactive mode (TUI)
description: The terminal UI — editor features, keyboard shortcuts, slash commands, and themes.
group: Using phi
order: 3
---

`phi` starts the TUI: a chat transcript on top, an editor at
the bottom, and a footer with the current activity. When a newer release is
available, the footer shows a hint like `0.2.0 available · phi update`.

![phi TUI](/assets/img/image.png)

Assistant output is rendered as Markdown (CommonMark/GFM): headings, emphasis,
strikethrough, links, blockquotes, lists, task checkboxes, and tables are
styled with the active theme; fenced code blocks get a muted language caption
and per-language syntax highlighting. Structural markers (`#`, backticks,
`*`) are stripped.

## Editor

- `@` — fuzzy file mention picker (type `@` and start typing a path)
- `/` — slash command picker (`/sessions`, `/branch`, `/skill`, `/new`,
  `/fork`, `/diff`, `/code`)
- `?` — shortcut help picker (lists `/`, `!`, `@`, and key bindings; `Esc` closes)
- `!command` — run a shell command locally and stream its output into the
  transcript (see [Commands](#commands))
- `Ctrl+K` — command palette: settings → model / theme / permissions / agents
  (incl. per-role models), extensions

## Keyboard shortcuts

| Key | Action |
| -------------- | ------------------------------- |
| `Ctrl+C` | Quit phi |
| `Esc` | Cancel the running agent / close pickers |
| `Ctrl+K` | Toggle the command palette |
| `Ctrl+A` | Jump to the start of the line |
| `Ctrl+E` | Jump to the end of the line |
| `Ctrl+U` | Clear the composer input, images, and skills |
| `Ctrl+Shift+C` | Copy the selected transcript text |

Themes: `Dark` (default), `Darcula`, `Pink`, and `Terminal`, switchable from
the palette under settings → theme.

## Commands

| Command | Description |
| ------------------ | --------------------------------------------- |
| `phi` | Start the interactive TUI |
| `phi run -p "…"` | Run one agent loop headlessly |
| `phi update` | Download and install the latest GitHub release |
| `phi update --check` | Query the latest release without installing |
| `phi sessions` | List persisted sessions for this directory |
| `phi sessions fork <id>` | Copy a session at its current point, print the new id |
| `phi sessions remove <id>` | Delete a session (alias `rm`; id prefix ok) |
| `/sessions` | List sessions for this directory (TUI) |
| `/new` | Start a fresh empty session (TUI) |
| `/fork` | Copy this session at its current point into a new one (TUI) |
| `/branch` | Switch the working branch (picker, or `/branch <name>`) |
| `/diff` | Full-screen git review — see [Diff review](#diff-review) |
| `/code` | Full-screen source viewer — see [Code viewer](#code-viewer) |
| `/skill` | Pick a skill to apply to the next message (TUI) |
| `!command` | Run a shell command locally, stream output into the transcript; `Esc` cancels it |

`!!command` works like `!command` but also adds the output to the model
context for the next turn (the transcript row is marked `· ctx`).

In the TUI, `!command` runs locally via `bash -c` — outside the agent loop. It
doesn't count toward agent busy state, and the running command can be cancelled
with `Esc` without touching an in-flight agent turn.

## Diff review

`/diff` opens a full-screen git review inside the TUI — read the change, leave
line notes, then hand them to the agent without leaving the terminal.

![phi diff review](/assets/img/diff.png)

| Command | What opens |
| --- | --- |
| `/diff` | A searchable picker of changed files; select one to review it against `HEAD` |
| `/diff staged` | Staged changes |
| `/diff HEAD` | Last commit (`git show`) |
| `/diff @path` | Only that file — `@` comes from file completion, the `--` separator is added for you |
| `/diff staged @a.go @b.go` | Staged changes in two files |
| `/diff HEAD @path` | That file against `HEAD` |
| `/diff main..feat @path` | That file across a range |

`/diff -- <argv>` runs the given git command instead of a diff —
`/diff -- git show HEAD~1` for one.

The slash picker inserts `/diff` with a trailing space; submit to open.
Inside the overlay: `j` / `k` move, `s` toggles side-by-side, `i` adds or
edits a note, `x` deletes, `a` sends the notes to the agent, `?` shows help,
`q` / `Esc` close. Notes live in the overlay's memory only — switching diffs
drops them and nothing is written to disk.

## Code viewer

`/code` opens a searchable file picker; selecting a file opens a full-screen
source viewer. Explicit `/code <path>[:line]` and `/code @path` skip the
picker. The viewer has syntax highlighting, a CJK-aware caret (`j`/`k`,
`h`/`l`, `gg`/`G`), in-file search (`/`, then `n`/`N`), and `:line` to jump
to a line. Press `v` for lines or `p` for the paragraph under the caret, then
`a` to hand the selection to the chat input as a `path:12-18` reference the
model reads. The pane reads files itself and answers to the same deny list as
the tool gate, so sensitive paths (`~/.ssh`, `.env`, …), binaries and files
over 8 MiB are refused with a toast.

## Branch switching

`/branch` opens the branch picker for the working directory: branch name plus
its most recent commit, `●` marks the branch HEAD is on. Enter runs
`git switch` off the UI goroutine. `/branch <name>` skips the picker —
switches to that branch, or creates it from HEAD when no branch carries the
name yet. `/branch <name> <base>` creates the branch off `<base>` (local or
remote-tracking) instead.

Uncommitted work is never touched: git refuses rather than lose it, and its
reason is toasted verbatim. Switching is blocked while a reply or command is
running, and while a merge, rebase, cherry-pick, revert, or bisect is
unfinished. In the picker, `Ctrl+X` then `Y` deletes a local branch
(unmerged branches are refused).

## Skills picker

`/skill` opens a filterable list of skills; accepting a row attaches the skill
to the next turn. Skills live outside the Ctrl+K palette now.
