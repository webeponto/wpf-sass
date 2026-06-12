---
name: wpf3-bugs
description: Use this skill when a WPF3 bug is found, confirmed, or resolved during a session. Triggers when: a CSS generation issue is verified as a real defect in the engine or patterns, a known issue is referenced, the user asks to check known WPF3 bugs, a previously reported bug has been fixed, or the user asks to register or look up a problem in the WPF3 bug registry. Works alongside wpf3-autofixer — autofixer diagnoses, wpf3-bugs records.
---

# WPF3 Bug Registry — Protocol

The bug registry lives at `.github/instructions/wpf3-bugs.instructions.md` inside the project repository. This skill defines the format and workflow for reading, writing, and updating that file.

## Registry Location

```
.github/instructions/wpf3-bugs.instructions.md
```

If the file does not exist in the project, create it with the header:
```markdown
# WPF3 Bug Registry

Report below any bugs or problems related with the WPF3 infrastructure found by AI agents during troubleshooting.
```

## Bug Entry Format

Each entry uses the following structure:

```markdown
## BUG-XXX — [short title]

**Status:** `open` | `resolved` | `known-limitation`
**Reported:** YYYY-MM-DD
**Resolved:** YYYY-MM-DD *(omit if not resolved)*
**Area:** `engine` | `yaml-patterns` | `scss-static` | `typescript-modules` | `build`
**Affected versions:** e.g. `3.0.x`

### Symptom
[What the user observed. Be concrete — include the class name or pattern that failed.]

### Root Cause
[What actually caused it. Include function name in render.js or pattern name in YAML if applicable.]

### Fix
[What was changed to resolve it. Include file paths and the specific change.]

### Prevention
[How to avoid this in the future, or why it's a known limitation.]
```

Number entries sequentially: BUG-001, BUG-002, etc. Read the file first to determine the next number.

## Workflow

### When a bug is discovered during a session

1. Finish diagnosing with wpf3-autofixer protocol first — only register confirmed defects, not suspected issues
2. Read `.github/instructions/wpf3-bugs.instructions.md` to check if this bug is already registered
3. If already registered (same symptom + root cause): update `Status` to `open` if it was marked `resolved`, add a note about recurrence
4. If new: append a new entry with status `open`, fill all fields you have, leave `Resolved` and `Fix` blank
5. After fix is confirmed working: update the entry — set `Status` to `resolved`, fill `Resolved` date and `Fix` field

### When the user reports a problem

1. Read the registry first
2. If a matching `open` or `known-limitation` entry exists: report it to the user with the entry number, root cause, and fix (if any)
3. If no match: treat as new — diagnose with wpf3-autofixer, then register if confirmed real

### When asked to check known bugs

Read `.github/instructions/wpf3-bugs.instructions.md` and summarize:
- Open bugs (unresolved)
- Relevant resolved bugs if they match the current context
- Known limitations that apply to what the user is trying to do

## Classification Guide

| Area | Covers |
|------|--------|
| `engine` | render.js logic — class extraction, CSS generation, file watching, context detection |
| `yaml-patterns` | regex errors, wrong cssTemplate, missing patterns, consolidation failures |
| `scss-static` | _default.scss, _vars.scss, mixins, functions, class-functions (bg(), c(), etc.) |
| `typescript-modules` | Painter, Pseudos, LazyLoad, Themes runtime behavior |
| `build` | tsc compilation, sass build, cpx copy, dist output issues |

## Example Entry

```markdown
## BUG-001 — gap-r / gap-c producing SCSS conditional in output

**Status:** `resolved`
**Reported:** 2025-06-10
**Resolved:** 2025-06-10
**Area:** `yaml-patterns`
**Affected versions:** `3.0.x`

### Symptom
Classes `gap-r-10px` and `gap-c-10px` generated `#{if(c=='r','row-gap','column-gap')}: 10px` instead of `row-gap: 10px` / `column-gap: 10px`.

### Root Cause
Pattern `gap-row-col-alias` used a consolidated cssTemplate with `#{if()}` conditional — render.js performs string substitution only and does not evaluate SCSS expressions.

### Fix
Replaced consolidated pattern with two separate patterns in `wpf.config.yaml`:
- `gap-row-alias`: regex `^gap-r-...` → `row-gap: $1$2`
- `gap-col-alias`: regex `^gap-c-...` → `column-gap: $1$2`

### Prevention
Never use `#{if()}` or any SCSS expression in `cssTemplate`. Use separate patterns whenever different CSS property names are needed for different input values.
```

## Registry Maintenance Rules

- **Only register confirmed bugs** — not suspicions, not user errors, not configuration problems
- **One entry per root cause** — if two symptoms share the same root cause, use one entry with both symptoms described
- **Keep Fix field precise** — include exact file and what changed (helps future reference)
- **Do not delete entries** — mark as `resolved` or `known-limitation` instead
- **Known limitations** are valid entries — e.g., "render.js does not support template literals for class binding"
