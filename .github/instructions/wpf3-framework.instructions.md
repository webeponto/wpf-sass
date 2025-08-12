---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow### **Missing Patterns Added to WPF3:**
- **Gap Support**: Added `gap-5px`, `gap-x-10px`, `gap-y-15px` patterns for flexbox/grid spacing
- **Common Pattern**: `gap-(\d*\.?\d+)(px|em|rem|%)` generates `gap: $1$2`
- **CSS Grid Support**: Added `dp-grid`, `col-1`, `span-col-1` patterns for CSS Grid layout
- **Grid Patterns**: `dp-grid` (display), `col-(\d+)` (template columns), `span-col-(\d+)` (column span)

### 🔍 **Migration Detection Strategy**
1. **Search for legacy patterns**: `w100`, `w-100`, `h100`, `h-100`
2. **Check SCSS files**: Look in `resources/scss/` for undefined utilities
3. **Identify missing functionality**: Classes that should exist in WPF3 but don't
4. **Add to wpf.config.yaml**: Extend framework with missing patterns
5. **⚠️ Use comprehensive regex search**: `w-100|w100|h-100|h100` to catch ALL occurrences
6. **🆕 Check for layout patterns**: `dp-grid`, `col-\d+`, `span-col-\d+` for CSS Grid functionality

### 🚨 **CRITICAL: WPF2 → WPF3 Migration Rule**
**ABSOLUTE RULE**: ALL classes `w-100` and `h-100` MUST be migrated to `w-100%` and `h-100%` in WPF3.
- ❌ **NEVER assume** `w-100` is correct in WPF3 - it's ALWAYS WPF2 legacy
- ❌ **NEVER differentiate** between "layout containers" vs "utility classes" 
- ✅ **ALWAYS migrate** `w-100` → `w-100%` and `h-100` → `h-100%`
- ✅ **NO EXCEPTIONS** - this rule applies to ALL contexts (headers, containers, forms, etc.)

**Search Pattern for Complete Detection:**
```regex
w-100(?!%)|h-100(?!%)|w100|h100
```

**AI Assistant Notes:**
- When you see `w-100` or `h-100` without `%`, it's ALWAYS WPF2 that needs migration
- Don't trust your judgment about "layout appropriateness" - migrate ALL instances
- Use the negative lookahead `(?!%)` to exclude already migrated classes

**🔍 Systematic Verification Protocol:**
1. **NEVER trust initial verification** - always do final comprehensive sweep
2. **Use exact regex pattern** `w-100(?!%)|h-100(?!%)|w100|h100` for detection
3. **Verify components referenced in main files** - they often contain legacy classes
4. **Document each discovery** to improve future migration accuracy

### 🎯 **WPF3 Pattern Types Understanding**

**Standard Patterns (Independent):**
- Direct regex-to-CSS mapping
- Work independently of other classes
- Examples: `p-10px`, `w-100%`, `dp-flex`, `dp-grid`

**Contextual Patterns (Dependent):**
- Require parent/sibling classes to function
- Behavior changes based on context
- Examples: `v-center` (works differently in `row` vs `col`)
- Structure: `requires` → `mediators` → `properties` → `rules`

**Adding New Patterns:**
```yaml
# Independent pattern
pattern-name:
  regex: '^pattern-(\d+)(px|%)$'
  cssTemplate: "{selector} { property: $1$2; }"

# Contextual pattern  
contextPatterns:
  context-name:
    requires: ["parent-class"]
    mediators:
      mediator1: "mediator1"
    properties:
      child-class:
        selector: ".$mediator .$prop, .$mediator.$prop"
        rules:
          mediator1: "css-property: value;"
```

### 🚨 **CRITICAL: YAML Pattern Guidelines**

**❌ NEVER use `#{if()}` conditionals for different CSS property names:**
```yaml
# WRONG - generates invalid CSS like .gap-c-10px { #{if(c=='r','row-gap','column-gap')}: 10px; }
gap-consolidated:
  regex: '^gap-([rc])-(\d+)(px)$'
  cssTemplate: "{selector} { #{if($1=='r','row-gap','column-gap')}: $2$3; }"
```

**✅ ALWAYS use separate patterns for different properties:**
```yaml
# CORRECT - generates valid CSS
gap-row-alias:
  regex: '^gap-r-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { row-gap: $1$2; }"

gap-col-alias:
  regex: '^gap-c-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { column-gap: $1$2; }"
```

**✅ CAN use direct substitution when values match:**
```yaml
# CORRECT - $1 maps directly to CSS values
direction:
  regex: '^(ltr|rtl)$'
  cssTemplate: "{selector} { direction: $1; }"
```

**Why**: render.js only does string replacement - it doesn't process SCSS conditionals. The output must be valid CSS that browsers can understand.rating code, answering questions, or reviewing changes.

# WPF 3.0 Framework - AI Coding Guidelines

<!-- WPF3_FRAMEWORK_INSTRUCTIONS_START -->
<!-- 
  🎯 IDENTIFICAÇÃO: Instruções específicas do Framework WPF 3.0
  📋 ESCOPO: Framework CSS dinâmico com geração contextual
  🔧 VERSÃO: v3.0.0
  📍 NAMESPACE: wpf3-framework
-->

## Project Overview
WPF 3.0 is a dynamic CSS utility framework that combines human-readable class syntax with context-aware CSS generation. Unlike traditional frameworks, it uses regex patterns and contextual intelligence to generate CSS from intuitive class names.

## 🔍 Integration Context Recognition

When working with projects that use WPF 3.0, look for these markers to identify framework-specific needs:

### WPF 3.0 Framework Files:
- `src/js/wpf/dynamic/render.js` - Core engine
- `src/js/wpf/dynamic/wpf.config.yaml` - Pattern configuration
- `src/sass/wpf/` - Framework SCSS modules
- Files with `@use "wpf"` or `@forward "wpf"` imports
- Classes matching WPF patterns: `t-center`, `p-10px`, `dp-flex row v-center`

### 📂 File Location Detection Guide

**CRITICAL**: WPF 3.0 core files are in JavaScript directories, NOT SCSS directories!

**Common locations to search:**
1. **Laravel/PHP Projects**: `resources/js/panel/wpf/dynamic/`
2. **React/Next.js**: `src/js/wpf/dynamic/` or `src/utils/wpf/dynamic/`
3. **Vue/Nuxt**: `assets/js/wpf/dynamic/` or `utils/wpf/dynamic/`
4. **Node.js Projects**: `src/wpf/dynamic/` or `lib/wpf/dynamic/`

**Search patterns to find WPF3 files:**
```bash
# Find render.js
**/wpf/dynamic/render.js
**/wpf/**/render.js
**/*render.js (contains WPF3 framework comments)

# Find wpf.config.yaml
**/wpf.config.yaml
**/wpf/dynamic/wpf.config.yaml
**/wpf/**/wpf.config.yaml
```

**File identification markers:**
- `render.js` - Contains "@property WPF3 - Framework CSS Dinâmico"
- `wpf.config.yaml` - Contains "FRAMEWORK SCSS WPF 3" header
- Config has `directoriesToWatch:` and `outputSCSS:` keys

### Context Indicators:
```yaml
# In wpf.config.yaml - This indicates WPF 3.0 integration
directoriesToWatch:
  - "src/components"
outputSCSS: "path/to/wpf-dynamic.scss"
```

```javascript
// In JS files - WPF modules usage
import { wpf } from './wpf/index.ts';
const { Themes, Painter, LazyLoad } = wpf;
```

```scss
// In SCSS files - WPF imports
@use "wpf/vendor";
@use "wpf/mods";
```

## WPF2 → WPF3 Migration Patterns

### 🔄 **Common Migration Patterns**
Based on real migration experience from the WPLabs CMS project:

**Width Classes (Legacy → WPF3):**
- `w100` → `w-100%`
- `w-100` → `w-100%`
- `w75` → `w-75%`
- `w50` → `w-50%`

**Height Classes (Legacy → WPF3):**
- `h100` → `h-100%`
- `h-100` → `h-100%`

**Missing Patterns Added to WPF3:**
- **Gap Support**: Added `gap-5px`, `gap-x-10px`, `gap-y-15px` patterns for flexbox/grid spacing
- **Common Pattern**: `gap-(\d*\.?\d+)(px|em|rem|%)` generates `gap: $1$2`
- **Responsive Visibility**: Added `mobile` and `desktop` classes for 1024px breakpoint control

### 📱 **Responsive Visibility Classes (New in WPF3)**
- **`.mobile`**: Visible ≤1023px, hidden ≥1024px (perfect for mobile-only elements)
- **`.desktop`**: Hidden ≤1023px, visible ≥1024px (perfect for desktop-only elements)
- **Usage**: `<div class="mobile">Mobile Menu</div>` or `<nav class="desktop">Full Navigation</nav>`

### 🔍 **Migration Detection Strategy**
1. **Search for legacy patterns**: `w100`, `w-100`, `h100`, `h-100`
2. **Check SCSS files**: Look in `resources/scss/` for undefined utilities
3. **Identify missing functionality**: Classes that should exist in WPF3 but don't
4. **Add to wpf.config.yaml**: Extend framework with missing patterns
5. **⚠️ Use comprehensive regex search**: `w-100|w100|h-100|h100` to catch ALL occurrences

### 📝 **Migration Notes**
- Always test CSS generation after adding new patterns
- Legacy width/height classes use percentage units in WPF3
- Gap functionality was missing and needed to be added to framework
- Contextual classes (like `v-center` in flex) work correctly during migration
- **Component Migration**: Check Blade components in `resources/views/components/panel/` for legacy classes
- **Common Component Classes**: `w100`, `w-100` frequently found in button.blade.php and fieldset.blade.php
- **Preserve Component-Specific Classes**: Classes like `full-width` in forms are component-specific, not utility classes

## Core Architecture

### Dynamic CSS Generation System
- **Pattern Engine**: `src/js/wpf/dynamic/render.js` - The heart of the framework that watches files and generates CSS
- **Configuration**: `src/js/wpf/dynamic/wpf.config.yaml` - Defines regex patterns and CSS templates for utility classes
- **Output**: Generates `wpf-dynamic.scss` in the configured output directory

### 🚨 Critical File Locations - AI Assistant Guide

**When helping with WPF3 integration, ALWAYS search for these files first:**

1. **Find the Engine (`render.js`):**
   ```bash
   # Search patterns (in order of priority):
   resources/js/**/wpf/dynamic/render.js    # Laravel
   src/js/**/wpf/dynamic/render.js          # React/Vue
   src/utils/**/wpf/dynamic/render.js       # Next.js
   assets/js/**/wpf/dynamic/render.js       # Nuxt
   ```

2. **Find the Config (`wpf.config.yaml`):**
   ```bash
   # Usually in the same directory as render.js:
   **/wpf/dynamic/wpf.config.yaml
   ```

3. **Verify Integration Markers:**
   ```javascript
   // render.js should contain this header:
   /**
    * @property WPF3 - Framework CSS Dinâmico
    * @version Versão: 3.0.0
    */
   ```

   ```yaml
   # wpf.config.yaml should contain:
   #? FRAMEWORK SCSS WPF 3
   directoriesToWatch:
   outputSCSS:
   ```

4. **Generated Output Location:**
   ```bash
   # Look for auto-generated CSS file:
   **/wpf/vendor/dynamic/wpf-dynamic.scss
   ```

**🔍 AI Search Strategy:**
1. First, use `file_search` with patterns: `**/render.js`, `**/wpf.config.yaml`
2. If not found, use `grep_search` for "WPF3 - Framework CSS" or "FRAMEWORK SCSS WPF 3"
3. Check `package.json` for WPF3-related scripts: "wpf:watch"
4. Look for generated files: `wpf-dynamic.scss`

### Key Components
1. **TypeScript Modules** (`src/js/wpf/`):
   - `index.ts` - Main entry point exporting LazyLoad, Pseudos, Painter, Themes
   - `themes.ts` - Theme switching with MutationObserver for dynamic class changes
   - `painter.ts` - Color/styling utilities
   - `lazyload.ts` - Lazy loading functionality
   - `pseudos.ts` - Pseudo-element utilities

2. **SCSS Architecture** (`src/sass/`):
   - `index.scss` - Main entry importing core, vars, and wpf modules
   - `core/` - Base styles, fonts, cursors
   - `vars/` - Configuration variables and theme definitions
   - `wpf/vendor/` - Framework utilities including dynamic CSS imports

## Dynamic Pattern System

### Pattern Types in `wpf.config.yaml`:

**Standard Patterns**: Direct regex-to-CSS mapping
```yaml
text-align:
  regex: "^t-(left|center|right|start|end|justify)$"
  cssTemplate: "{selector} { text-align: $1; }"
```

**Context Patterns**: Classes that change behavior based on parent context
```yaml
contextPatterns:
  flex-context:
    requires: ["dp-flex"]
    mediators: { row: "row", col: "col" }
    properties:
      v-center: # Same class generates different CSS based on row/col context
```

### Class Naming Conventions
- **Positioning**: `absolute`, `top(50%)`, `center(v)`
- **Spacing**: `p-10px`, `m-20rem`, `mx-5%`
- **Typography**: `t-center`, `fs-16px`, `tt-uppercase`
- **Borders**: `b-2px-solid`, `rounded-5px`
- **Layout**: `dp-flex row v-center` (contextual)

## Development Workflow

### 🔄 **CRITICAL: Engine Restart Protocol**
**ALWAYS restart WPF3 engine after config changes:**

1. **Check for running processes**: `tasklist | findstr node` (Windows) or `ps aux | grep node` (Unix)
2. **Kill WPF3 processes**: `taskkill /F /IM node.exe` or find specific PID
3. **Restart engine**: `npm run wpf:watch` or `node resources/js/panel/wpf/dynamic/render.js`
4. **Verify new patterns**: Check console output for updated pattern count

**⚠️ Config changes requiring restart:**
- New patterns in `wpf.config.yaml`
- Changes to `directoriesToWatch`
- Updates to `contextPatterns`
- Breakpoint modifications

### File Watching & Generation
The `render.js` watches configured directories (`directoriesToWatch` in YAML) and:
1. Extracts class names from HTML/template files
2. Matches against regex patterns
3. Generates corresponding CSS rules
4. Outputs to dynamic SCSS files

### Key Functions in `render.js`:
- `extractBreakpoint()` - Handles responsive prefixes (`sm:`, `md:`)
- `generateCSSFromClass()` - Converts class to CSS using patterns
- `generateContextualCSS()` - Handles complex context-dependent classes
- `escapeSelector()` - Safely escapes CSS selectors

### Breakpoints Configuration
```yaml
breakpoints:
  sm: 576
  md: 768  
  lg: 992
  mob: 1024
  xl: 1200
```

### 🎯 **WPF3 Pattern Categories (Quick Reference)**

**🔹 LAYOUT & DISPLAY:**
- `dp-flex`, `dp-grid`, `dp-block`, `dp-inline`
- `row`, `col` (contextual with flex)
- `v-center`, `h-between`, `gap-20px` (contextual)

**🔹 SPACING:**
- `p-20px`, `mx-15px`, `gap-10px`
- `m-auto`, `p-0px`

**🔹 SIZING:**
- `w-100%`, `h-50px`, `w-auto` ⚠️ **Always use w-100% not w-100**
- `w-100px-max`, `h-50%-min`

**🔹 POSITIONING:**
- `absolute`, `relative`, `fixed`
- `center(c)`, `top(10px)`, `z-10`

**🔹 TYPOGRAPHY:**
- `fs-16px`, `t-center`, `lh-130%`
- `tt-uppercase`, `t-nowrap`

### Variable-based utilities (new)
- Purpose: allow runtime-tunable utilities via CSS variables while keeping classic numeric/unit forms.
- Syntax: use parentheses to provide a token that maps to a CSS variable name.
- Examples:
  - `fs-(title)` → `font-size: var(--title)`
  - `lh-(body)` → `line-height: var(--body)`
  - `gap-(space)` / `gap-x-(space)` / `gap-y-(space)` → `gap: var(--space)` / `column-gap: var(--space)` / `row-gap: var(--space)`
  - `p-(pad)` / `px-(pad)` / `py-(pad)` / `pt-(pad)` / `pr-(pad)` / `pb-(pad)` / `pl-(pad)` → padding via `var(--pad)`
  - `m-(m)` / `mx-(m)` / `my-(m)` / `mt-(m)` / `mr-(m)` / `mb-(m)` / `ml-(m)` → margin via `var(--m)`
  - `w-(w)` / `w-(w)-min` / `w-(w)-max` and `h-(h)` / `h-(h)-min` / `h-(h)-max` → sizing via `var(--w)` / `var(--h)`
- Notes:
  - Tokens are `[a-z0-9-]` by default (expandable later).
  - Works with breakpoints and `!` importance as usual.
  - Selectors are auto-escaped: `.fs-(title)` becomes `.fs-\(title\)` in CSS.

### Outline color utility: oc(valor)

Add outline color using a single, unified API that accepts either literal colors or variable tokens:

- Syntax: `oc(valor)`
- Accepted literal forms (no spaces inside rgb/rgba):
  - Hex: `oc(#fff)`, `oc(#ffffff)`, `oc(#ffffffff)`
  - RGB: `oc(rgb(255,255,255))`
  - RGBA: `oc(rgba(255,255,255,0.5))` (alpha supports integers or decimals)
- Token form: `oc(token)` maps to `outline-color: var(--token)` where `token` matches `[a-z0-9-]+`.

Examples:
- Works: `oc(#1e90ff)`, `oc(rgb(34,34,34))`, `oc(rgba(0,0,0,0.08))`, `oc(primary-500)` → `outline-color: var(--primary-500)`
- Not supported: `oc(rgba(255, 255, 255, 0.5))` (spaces are not allowed inside the class name)

Notes:
- This utility participates in responsive prefixes and `!` importance like other classes.
- Special characters in selectors are auto-escaped by the engine.

**🔹 RESPONSIVE & VISIBILITY:**
- `mobile`, `desktop` (auto-hide based on 1024px breakpoint)
- `mob:col`, `sm:fs-14px`

**🔹 BORDERS & EFFECTS:**
- `rounded-5px`, `b-2px-solid`
- `opacity-0.5`, `rotate-45deg`

## Extending the Framework

### Adding New Utility Patterns
1. Add regex pattern to `wpf.config.yaml` under `patterns:`
2. Define `cssTemplate` with placeholder substitution
3. The render engine automatically picks up new patterns

### Adding Context-Aware Classes  
1. Define in `contextPatterns:` section
2. Specify `requires:` array for prerequisite classes
3. Define `mediators:` for context switching
4. Map `properties:` to different CSS based on mediator

### SCSS Mixins (`src/sass/wpf/vendor/_mix.scss`)
- `@mixin responsive()` - Media query helper
- `@mixin centerPosition()` - Positioning utilities  
- `@mixin addVendors()` - Vendor prefix automation
- `@mixin container()` - Layout containers

## Important Notes

- **File Extensions Monitored**: The system scans for classes in HTML, PHP, JS, Vue, React files
- **Throttling**: Updates are throttled to 800ms to prevent excessive rebuilds  
- **Caching**: CSS generation uses signature-based caching to avoid duplicates
- **Escaping**: Special characters in class names are automatically escaped for CSS
- **Module System**: Uses `@forward` pattern for SCSS module organization

## Installation & Project Integration

### Essential Dependencies
Install these Node.js packages for full WPF 3.0 functionality:

```bash
# Core dependencies for dynamic CSS generation
npm install --save-dev chokidar glob js-yaml

# SCSS compilation
npm install --save-dev sass

# PostCSS ecosystem (optional but recommended)
npm install --save-dev postcss postcss-cli autoprefixer

# Production optimization
npm install --save-dev purgecss

# TypeScript support (if using TS modules)
npm install --save-dev typescript @types/node
```

### Project Structure Setup
Create this directory structure in your project:

```
your-project/
├── src/                      # or resources/ (Laravel)
│   ├── js/wpf/              # 🎯 CRITICAL: WPF core files location
│   │   ├── index.ts         # TypeScript modules entry
│   │   ├── themes.ts
│   │   ├── painter.ts
│   │   ├── lazyload.ts
│   │   ├── pseudos.ts
│   │   └── dynamic/         # 🔥 Engine location - SEARCH HERE FIRST
│   │       ├── render.js    # Core CSS generation engine
│   │       └── wpf.config.yaml # Pattern definitions & config
│   └── sass/                # or scss/ - SCSS framework files
│       ├── index.scss
│       ├── core/
│       ├── vars/
│       └── wpf/
│           ├── vendor/
│           │   └── dynamic/
│           │       ├── _index.scss
│           │       ├── _lazyload.scss
│           │       └── wpf-dynamic.scss  # 🤖 AUTO-GENERATED
│           └── mods/
└── package.json
```

### 🔧 Framework Location Patterns by Ecosystem

**Laravel/PHP Projects:**
```
resources/
├── js/panel/wpf/dynamic/    # 👈 Engine location
│   ├── render.js
│   └── wpf.config.yaml
└── scss/panel/wpf/vendor/dynamic/
    └── wpf-dynamic.scss     # 👈 Generated output
```

**React/Next.js Projects:**
```
src/
├── utils/wpf/dynamic/       # 👈 Engine location
│   ├── render.js
│   └── wpf.config.yaml
└── styles/wpf/vendor/dynamic/
    └── wpf-dynamic.scss     # 👈 Generated output
```

**Vue/Nuxt Projects:**
```
utils/wpf/dynamic/           # 👈 Engine location
├── render.js
└── wpf.config.yaml
assets/scss/wpf/vendor/dynamic/
└── wpf-dynamic.scss         # 👈 Generated output
```

### Configuration Steps

1. **Update `wpf.config.yaml`** for your project paths:
```yaml
directoriesToWatch:
  - "src/views"           # Your HTML/template files
  - "src/components"      # React/Vue components
  - "public"              # Static files
  
outputSCSS: "src/sass/wpf/vendor/dynamic/wpf-dynamic.scss"
```

2. **Configure PurgeCSS** (`purgecss.config.js`):
```javascript
module.exports = {
    content: [
        './src/**/*.{html,js,ts,jsx,tsx,vue,php}',
        './public/**/*.html',
    ],
    css: ['dist/css/main.css'],
    output: 'dist/css/main.min.css',
    defaultExtractor: (content) => content.match(/[\w-/:()\[\],]+(?<!:)/g) || [],
};
```

3. **Package.json scripts**:
```json
{
  "scripts": {
    "wpf:watch": "node src/js/wpf/dynamic/render.js",
    "sass:watch": "sass --watch src/sass:dist/css",
    "sass:build": "sass src/sass:dist/css --style compressed",
    "purge": "purgecss --config purgecss.config.js",
    "build": "npm run sass:build && npm run purge"
  }
}
```

### Framework Integration Examples

**Laravel/PHP Projects:**
```yaml
# wpf.config.yaml
directoriesToWatch:
  - "resources/views"
  - "resources/js"
outputSCSS: "resources/sass/wpf/vendor/dynamic/wpf-dynamic.scss"
```

**React/Next.js Projects:**
```yaml
# wpf.config.yaml  
directoriesToWatch:
  - "src/components"
  - "src/pages"
  - "public"
outputSCSS: "src/styles/wpf/vendor/dynamic/wpf-dynamic.scss"
```

**Vue/Nuxt Projects:**
```yaml
# wpf.config.yaml
directoriesToWatch:
  - "components"
  - "pages"
  - "layouts"
outputSCSS: "assets/scss/wpf/vendor/dynamic/wpf-dynamic.scss"
```

### 📋 WPF3 Integration Checklist for AI Assistants

When working with WPF3, verify these elements in order:

**✅ Essential Files Found:**
- [ ] `render.js` located in JavaScript directory (not SCSS)
- [ ] `wpf.config.yaml` in same directory as render.js
- [ ] TypeScript modules: `index.ts`, `themes.ts`, `painter.ts`, etc.
- [ ] SCSS structure with `wpf/vendor/dynamic/` directory

**✅ Dependencies Installed:**
- [ ] `chokidar` - File watching
- [ ] `glob` - File pattern matching  
- [ ] `js-yaml` - YAML parsing
- [ ] `typescript` & `@types/node` - TypeScript support

**✅ Scripts Configured:**
- [ ] `"wpf:watch": "node path/to/render.js"` in package.json
- [ ] Build scripts include generated CSS
- [ ] Development workflow includes WPF3 engine

**✅ Integration Working:**
- [ ] `wpf-dynamic.scss` generated automatically
- [ ] Dynamic CSS imported in main SCSS
- [ ] Classes like `dp-flex row v-center` working
- [ ] Responsive prefixes functional (`mob:`, `sm:`, etc.)

### Development Workflow
1. **Start the engine**: `npm run wpf:watch` (monitors files and generates CSS)
2. **Compile SCSS**: `npm run sass:watch` (watches SCSS changes)
3. **Use classes**: Add WPF classes to your HTML/components
4. **Build production**: `npm run build` (optimized and purged CSS)

## Build & Deployment
- **PurgeCSS**: Configured in `purgecss.config.js` for production optimization
- **No build step required**: Framework generates CSS dynamically during development
- **TypeScript**: Compile TS modules separately if needed for production

## Testing Patterns
- Test utility classes by adding them to HTML and verifying CSS generation
- Use browser dev tools to inspect generated dynamic styles
- Check `wpf-dynamic.scss` output for expected CSS rules

## 🏷️ WPF 3.0 Integration Guidelines for Host Projects

### Recommended Copilot Instructions Structure
When integrating WPF 3.0 into existing projects, organize your `copilot-instructions.md` like this:

```markdown
# [Your Project Name] - AI Coding Guidelines

## Project-Specific Instructions
<!-- PROJECT_SPECIFIC_START -->
[Your project's unique patterns, APIs, business logic, etc.]
<!-- PROJECT_SPECIFIC_END -->

## Framework Instructions

### WPF 3.0 Framework
<!-- WPF3_FRAMEWORK_START -->
<!-- Include or reference WPF 3.0 specific instructions -->
See: .wpf/copilot-instructions.md for WPF 3.0 patterns
<!-- WPF3_FRAMEWORK_END -->

### Other Frameworks
<!-- OTHER_FRAMEWORKS_START -->
[Next.js, Laravel, Vue, etc. specific instructions]
<!-- OTHER_FRAMEWORKS_END -->
```

### File Organization Strategy

1. **Main Project Instructions**: `/.github/copilot-instructions.md`
   - Project-specific business logic
   - API conventions
   - Database patterns
   - Testing strategies

2. **WPF 3.0 Instructions**: `/.wpf/copilot-instructions.md` or `/docs/wpf3-guidelines.md`
   - Copy this entire file
   - Framework-specific patterns
   - CSS generation rules
   - Integration examples

3. **Reference Pattern**:
```markdown
<!-- In your main copilot-instructions.md -->

## CSS Framework: WPF 3.0
For WPF 3.0 specific patterns and conventions, see:
- File: `.wpf/copilot-instructions.md`
- Scope: Dynamic CSS generation, utility classes, contextual patterns
- Key Files: `src/js/wpf/`, `src/sass/wpf/`, `wpf.config.yaml`
```

### AI Context Switching Markers

Use these comments to help AI agents understand context:

```html
<!-- WPF3_CONTEXT: Using framework utility classes -->
<div class="dp-flex row v-center h-between p-20px">
  <!-- Regular project HTML -->
</div>
```

```scss
/* WPF3_CONTEXT: Framework mixins and patterns */
@use "wpf/vendor" as wpf;

.my-component {
  @include wpf.responsive(md) {
    /* Project-specific responsive code */
  }
}
```

```javascript
// WPF3_CONTEXT: Framework modules
import { wpf } from './wpf/index.ts';

// PROJECT_CONTEXT: Application logic
class MyComponent {
  constructor() {
    this.themes = new wpf.Themes(new wpf.Painter());
  }
}
```

### Quick Recognition Commands

Train AI to recognize WPF 3.0 context with these patterns:

- **Files ending in**: `wpf.config.yaml`, `/wpf/*.ts`, `/wpf/*.scss`
- **Classes matching**: `^(t|p|m|dp|fs|lh|b|rounded|scale|rotate|translate)-.*`
- **Imports containing**: `"wpf"`, `@use "wpf"`, `@forward "wpf"`
- **Comments starting with**: `WPF3_CONTEXT:`, `<!-- WPF3_FRAMEWORK`

<!-- WPF3_FRAMEWORK_INSTRUCTIONS_END -->
