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

## Core Architecture

### Dynamic CSS Generation System
- **Pattern Engine**: `src/js/wpf/dynamic/render.js` - The heart of the framework that watches files and generates CSS
- **Configuration**: `src/js/wpf/dynamic/wpf.config.yaml` - Defines regex patterns and CSS templates for utility classes
- **Output**: Generates `wpf-dynamic.scss` in the configured output directory

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
├── src/
│   ├── js/wpf/               # Copy WPF TypeScript modules
│   │   ├── index.ts
│   │   ├── themes.ts
│   │   ├── painter.ts
│   │   ├── lazyload.ts
│   │   ├── pseudos.ts
│   │   └── dynamic/
│   │       ├── render.js     # Core engine
│   │       └── wpf.config.yaml
│   └── sass/                 # Copy SCSS architecture
│       ├── index.scss
│       ├── core/
│       ├── vars/
│       └── wpf/
└── package.json
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
