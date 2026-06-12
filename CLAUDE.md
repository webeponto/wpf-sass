# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

WPF3 (Web e Ponto Framework 3.0) is a dynamic CSS utility framework authored by Lyautey M. Neto, Matheus Patrignani, and David Henderson. It generates CSS from human-readable class names using regex patterns defined in YAML, combined with a static SCSS architecture for variables, color class-functions, mixins, animations, and pre-built components.

Current version: **v3.0.4 Alpha**. Published as `@webeponto/wpf3` on npm.

## Build & Development Commands

```bash
npm run build          # Full build: TS → JS, copy SCSS, compile CSS
npm run build:js       # TypeScript only (tsc --project tsconfig.build.json)
npm run build:css      # SCSS → compressed CSS (dist/css/wpf3.css)
npm run build:scss     # Copy SCSS sources to dist/scss/
npm run dev            # Alias for wpf:watch
npm run wpf:watch      # Start the dynamic CSS render engine (file watcher)
npm run clean          # Remove dist/
npm test               # Placeholder (no tests yet)
```

The dynamic engine (`npm run wpf:watch` / `node src/js/wpf/dynamic/render.js`) watches directories listed in `wpf.config.yaml → directoriesToWatch`, extracts class names from HTML/PHP/JS/Vue/JSX/TSX files, matches them against regex patterns, and outputs `wpf-dynamic.scss`. **You must restart the engine after editing `render.js`** — config YAML changes are hot-reloaded automatically.

## Architecture Overview

The framework has two halves that work together:

### 1. Dynamic CSS Engine (JavaScript — `src/js/wpf/dynamic/`)

- **`render.js`** — Core Node.js process. Uses chokidar for file watching, js-yaml for config parsing, glob for file discovery. Key functions:
  - `extractClassGroupsFromFile()` — Parses class names from HTML attributes, Blade expressions, Alpine.js/Vue bindings, and JS string patterns
  - `generateCSSFromClass()` — Matches a single class against regex patterns and produces CSS via template substitution (`$1`, `$2`, etc.)
  - `generateContextualCSS()` — Handles context-dependent classes (e.g., `v-center` behaves differently inside `dp-flex row` vs `dp-flex col`)
  - `extractBreakpoint()` — Strips responsive prefixes (`sm:`, `md:`, `lg:`, `mob:`, `xl:`) and `!` importance markers
  - `escapeSelector()` — Escapes special characters for CSS selectors
- **`wpf.config.yaml`** — All utility class definitions. Two sections:
  - `patterns:` — Standard regex→CSS mappings (independent classes)
  - `contextPatterns:` — Classes that change behavior based on sibling/parent classes (requires + mediators + properties)

### 2. Static SCSS Architecture (`src/sass/`)

- **`index.scss`** — Entry point, imports core → vars → wpf modules
- **`core/`** — CSS reset (`_reset.scss`), base styles, fonts, cursors
- **`vars/`** — Project-configurable variables:
  - `_default.scss` — Color palettes (backgrounds, surfaces, gradients, themes, text, borders, indicators), effects, cursors, fonts, transitions, font-weights. All values become CSS custom properties via `_vars.scss`
  - `_dark.scss` — Dark theme overrides (activated when `$hasDarkTheme: true` in `_config.scss`)
  - `_config.scss` — Single toggle: `$hasDarkTheme`
- **`wpf/vendor/`** — Framework utilities:
  - `_vars.scss` — Iterates over all variable maps from `_default.scss`, generating class-functions (`bg()`, `c()`, `bc()`, `f()`, `s()`, `fnt()`, `fx()`) and injecting CSS custom properties into `:root`. Supports responsive `mob:` variants
  - `_mix.scss` — SCSS mixins: `responsive()`, `centerPosition()`, `setPosition()`, `addVendors()`, `container()`, `generateGrid()`, `flexCenter()`, `generateShadow()`, `aspectRatio()`, `gradientBackground()`, `animateProperty()`, `buttonStyle()`, `cardStyle()`, `scrollbarStyle()`, `textGradient()`, `shortText()`, `manageZIndex()`, `renderArrow()`
  - `_fun.scss` — SCSS functions: `toRem()`, `stripUnit()`, `toEm()`, `calculateContrast()`, `lightenSmart()`, `darkenSmart()`, `getZIndex()`, `fluidSize()`, `generateSteps()`, `randomColor()`, `getBreakpoint()`, `clampSize()`, `colorAlpha()`
  - `_anim.scss` — 19 animation mixins: `spin`, `rotate`, `ping`, `pulse`, `ping-pulse`, `bounce`, `wiggle`, `shake-x`, `shake-y`, `float`, `swing`, `tilt`, `jelly`, `flip`, `heartbeat`, `hover-glow`, `underline-sweep`, `ripple`, `shimmer`, `highlight-sweep`
  - `dynamic/` — Contains the auto-generated `wpf-dynamic.scss` (do NOT edit) and `_lazyload.scss`
- **`wpf/mods/`** — Pre-built components:
  - `_buttons.scss` — Full button system (`.wpf3-btn`) with 8 semantic color variants, 3 style variants (outline/ghost/gradient), 4 sizes, animation effects, dark mode support

### 3. TypeScript Runtime Modules (`src/js/wpf/`)

Browser-side plugins exported via `index.ts` as `wpf.{ LazyLoad, Pseudos, Painter, Themes }`:

- **Painter** — Applies hex colors from class-functions (`bg(#hex)`, `c(#hex)`, `bc(#hex)`) at runtime via DOM manipulation + MutationObserver. Supports 3-8 digit hex values
- **Pseudos** — Implements pseudo-class behavior via JS event listeners: `hover:`, `active:`, `focus:`, `placeholder:`, `group-hover:`, `remote-hover:` prefixes
- **LazyLoad** — IntersectionObserver-based lazy loading for `.wpf-lazy-load` elements. Supports images and arbitrary elements. `.wpf-lazy-ignore` excludes elements
- **Themes** — Conditional class application based on active theme. Syntax: `theme.themeName[className]` — applies `className` when `html` has `.themeName-theme`. `theme.default[className]` applies when no theme class is present

## How the Dynamic Pattern System Works

### Standard Patterns

Direct regex-to-CSS mapping. The engine does **string replacement only** — `$1`, `$2` etc. map to regex capture groups:

```yaml
padding:
  regex: '^p-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { padding: $1$2; }"
```

Class `p-20px` → `.p-20px { padding: 20px; }`

### Contextual Patterns

Classes whose CSS output depends on sibling classes present on the same element:

```yaml
contextPatterns:
  flex-context:
    requires: ["dp-flex"]        # Parent class must be present
    mediators:
      row: "row"                 # Direction mediator
      col: "col"
    properties:
      v-center:                  # Same class, different output
        rules:
          row: "align-items: center;"
          col: "justify-content: center;"
```

Three contexts exist: `flex-context` (dp-flex), `inline-flex-context` (dp-flex-inline), `grid-context` (dp-grid).

### Variable-based Utilities

Token syntax with parentheses maps to CSS custom properties: `fs-(title)` → `font-size: var(--title)`. Available for font-size, line-height, gap, padding, margin, width, height, border, rounded, z-index, offset, transitions, scale, opacity, and more.

### Modifiers

- **Breakpoints**: `sm:`, `md:`, `lg:`, `mob:`, `xl:` prefixes (desktop-first, `max-width`). Values configured in YAML
- **Importance**: `!` prefix on any class adds `!important` (e.g., `!p-10px`)
- **Pseudo-classes**: `hover:`, `active:`, `focus:`, `placeholder:` (handled by Pseudos.ts at runtime)

## Key WPF3 Conventions

- **Percentage values require `%` symbol**: `w-100%` not `w-100` (breaking change from WPF2)
- **Negative values use double dash**: `p--30px` not `p-30px-neg` (WPF2 `-neg` suffix is deprecated)
- **Display classes require `dp-` prefix**: `dp-flex`, `dp-grid`, `dp-block`
- **Timing classes renamed**: `timing-ease-in` not `ease-ease-in`
- **Border shorthand**: `b-2px-solid` (width+style) vs `b-2px` (width only, defaults to solid)
- **Color class-functions** (`bg()`, `c()`, `bc()`, `f()`, `s()`) use variable tokens defined in `_default.scss`, not raw colors. For raw hex at runtime, use the Painter plugin
- **`render.js` does only string replacement** — never use SCSS conditionals like `#{if()}` in YAML `cssTemplate` values. When different CSS properties are needed, use separate patterns
- **YAML pattern consolidation rule**: Only consolidate when the same CSS property name is used with direct value substitution. Keep separate patterns when different property names are involved

## Adding New Utility Patterns

1. Add to `wpf.config.yaml` under `patterns:` with a `regex` and `cssTemplate`
2. The engine hot-reloads YAML changes — no restart needed
3. For context-dependent classes, add under `contextPatterns:` with `requires`, `mediators`, and `properties`
4. Test by checking `wpf-dynamic.scss` output and `wpf-classes-debug.txt` for detected classes

## Debugging the Engine

- `wpf-classes-debug.txt` — All detected class names (auto-generated alongside `wpf-dynamic.scss`)
- `wpf-status.txt` — Engine operational status and monitored directories
- If classes aren't detected: check `directoriesToWatch` in YAML, verify file extensions are supported (.html, .php, .js, .jsx, .tsx, .vue, .blade.php, .svg)
- If CSS is wrong: inspect `wpf-dynamic.scss` output, verify regex pattern matches the class
- **Always restart the engine after editing `render.js`** — YAML changes are auto-reloaded but JS changes are not

## File Extensions and Supported Frameworks

The engine extracts classes from: standard HTML `class=""`, React `className=""`, Alpine.js `x-bind:class`, Vue `:class`, Blade expressions `{{ $var ? 'class' : '' }}`, Blade functions `@svg('name', 'classes')`, and JS DOM manipulation patterns.

## Component Development

Components (like the button system in `_buttons.scss`) must use WPF3 CSS custom properties from `_default.scss` — never hardcode colors. Pattern: define component-level `--component-*` variables that reference WPF3 system variables (`--c-t1-400`, `--c-s-1`, `--t-fast`, etc.), then use component variables in styles.

## Existing Skills

This project has Claude Code skills defined for WPF3:
- `wpf3-framework` — Comprehensive knowledge about using the framework
- `wp3-autofixer` — Bug diagnosis and fix methodology for WPF3 issues

Refer to `.github/instructions/` for the full Copilot/AI instruction files that contain detailed pattern references and migration guides.
