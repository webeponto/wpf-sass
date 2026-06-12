---
name: wpf3-autofixer
description: Use this skill when the user reports a WPF3 problem — CSS not being generated, a class not working, the engine crashing, wrong CSS output, classes not detected, YAML pattern errors, or unexpected behavior after changes to render.js or wpf.config.yaml. Also triggers when the user says "WPF3 broke", "classe não funciona", "CSS não gerou", "engine parou", or asks to debug/fix the WPF3 infrastructure.
---

# WPF3 AutoFixer — Diagnóstico e Correção

## Mandatory Engine Restart Rule

**ALWAYS after modifying `render.js`:**
1. Kill all Node.js processes: `taskkill /F /IM node.exe`
2. Restart engine: `node <path-to>/render.js`
3. Wait for output files to regenerate (check timestamps)
4. Only then verify if changes took effect

YAML changes are auto-reloaded — no restart needed. JS changes require a full restart.

## Investigation Order

Work through this sequence before touching any code:

1. **Are classes detected?** → Check `wpf-classes-debug.txt`
2. **Is CSS generated?** → Check `wpf-dynamic.scss`
3. **Is engine running?** → `tasklist | findstr node`
4. **Is directory monitored?** → Check `directoriesToWatch` in `wpf.config.yaml`
5. **Is selector syntax valid?** → Inspect CSS output visually (must start with `.`)

If the class doesn't appear in `wpf-classes-debug.txt`, the problem is **detection** (file watcher, directory config, class extraction regex). If it appears there but not in `wpf-dynamic.scss`, the problem is **pattern matching** (YAML regex or cssTemplate).

## Locating Critical Files

These paths vary by project ecosystem:

| File | Laravel/PHP | React/Next.js | Vue/Nuxt |
|------|-------------|---------------|----------|
| Engine | `resources/js/wpf/dynamic/render.js` | `src/js/wpf/dynamic/render.js` | `utils/wpf/dynamic/render.js` |
| Config | same dir as engine — `wpf.config.yaml` | same | same |
| CSS output | `resources/scss/wpf/vendor/dynamic/wpf-dynamic.scss` | `src/styles/wpf/vendor/dynamic/wpf-dynamic.scss` | `assets/scss/wpf/vendor/dynamic/wpf-dynamic.scss` |
| Debug log | `wpf-classes-debug.txt` at project root | same | same |

When in doubt: `glob **/wpf/dynamic/render.js` to find the engine.

## Systematic Fix Steps

1. Identify the incorrect or missing CSS in `wpf-dynamic.scss`
2. Check `wpf-classes-debug.txt` — is the class detected?
3. If not detected: verify `directoriesToWatch` includes the file's directory, and that the file extension is in the watched extensions list
4. If detected but wrong CSS: find the matching pattern in `wpf.config.yaml`
5. Fix the regex or cssTemplate in YAML (auto-reloads) or fix logic in `render.js` (requires restart)
6. **Mandatory restart** if `render.js` was touched
7. Validate CSS syntax in `wpf-dynamic.scss`
8. Test in browser
9. Document the fix in `.github/instructions/wpf3-bugs.instructions.md` if it was a real bug

## Useful Diagnostic Commands

```bash
# Check if Node.js is running
tasklist | findstr node

# Kill all Node.js processes
taskkill /F /IM node.exe

# Start WPF3 engine (adapt path to project)
node resources/js/wpf/dynamic/render.js

# Compile SCSS
npm run sass:build

# Full dev build
npm run dev
```

## Supported Class Extraction Contexts

The engine's `extractClassGroupsFromFile()` reads classes from:
- HTML: `class="..."`
- React/JSX: `className="..."`
- Alpine.js: `x-bind:class="..."`, `x-class="..."`
- Vue.js: `:class="..."`, `v-bind:class="..."`
- Data attributes: `data-class="..."`

If a class exists in a format not listed above, the engine won't detect it. This requires a new extraction pattern in `render.js`.

## YAML Pattern Rules (Critical)

**render.js does string substitution only — no SCSS processing.**

| Rule | Correct | Wrong |
|------|---------|-------|
| Different CSS properties | Separate patterns | `#{if()}` conditionals |
| Direct value capture | `$1$2` in template | SCSS expressions |
| Token/variable variant | Separate `-var` pattern | Combined regex |

### When to consolidate patterns:

**OK to consolidate** — same CSS property, direct value:
```yaml
direction:
  regex: '^(ltr|rtl)$'
  cssTemplate: "{selector} { direction: $1; }"
```

**Keep separate** — different CSS properties:
```yaml
gap-row-alias:
  regex: '^gap-r-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { row-gap: $1$2; }"

gap-col-alias:
  regex: '^gap-c-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { column-gap: $1$2; }"
```

**Keep separate** — value needs transformation (`col` → `column`):
```yaml
grid-flow-col:
  regex: '^flow-col$'
  cssTemplate: "{selector} { grid-auto-flow: column; }"
```

## Safe vs. Risky Modifications

**Safe (low risk):**
- Editing `wpf.config.yaml` — auto-reloads, only affects CSS generation for matching classes
- Adding new patterns to YAML — additive, won't break existing classes
- Editing static SCSS files (`_default.scss`, component files) — compile step required

**Requires care:**
- Modifying regex in existing YAML patterns — can break all classes that matched before
- Changing `cssTemplate` in existing patterns — verify output in `wpf-dynamic.scss` after change
- Editing `directoriesToWatch` — can cause classes in some files to stop being detected

**High risk (always restart + validate):**
- Modifying `render.js` extraction logic (`extractClassGroupsFromFile`) — affects every class in every file
- Changing `generateCSSFromClass` or `generateContextualCSS` — affects all CSS output
- Modifying `escapeSelector` — can break all generated selectors
- Changing `resetConfigAndCache` — can break cache invalidation

## Validation Checklist

- [ ] Engine is running (`tasklist | findstr node`)
- [ ] Test files are in monitored directories
- [ ] Classes appear in `wpf-classes-debug.txt`
- [ ] CSS is generated in `wpf-dynamic.scss`
- [ ] CSS selectors have valid syntax (start with `.`)
- [ ] Classes work in browser
- [ ] Timestamps on output files are recent
- [ ] No `#{if()}` in `wpf-dynamic.scss` output

## Progressive Testing Protocol

Never make multiple changes simultaneously. For each fix:
1. Make one change
2. Restart engine if `render.js` was modified
3. Create a minimal test file in a monitored directory
4. Verify detection in `wpf-classes-debug.txt`
5. Verify CSS in `wpf-dynamic.scss`
6. Only proceed to the next change after confirming this one works
7. Clean up test files after validation
