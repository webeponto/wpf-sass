# 📦 WPF3 NPM Installation Guide

## Quick Installation

```bash
npm install @webeponto/wpf3
```

## Usage Patterns

### 1. 🎨 **SCSS Integration (Recommended)**
```scss
// Import the complete framework
@use '@webeponto/wpf3/scss' as wpf;

// Or import specific modules
@use '@webeponto/wpf3/scss/wpf/vendor' as vendor;
@use '@webeponto/wpf3/scss/wpf/mods' as mods;

// Use mixins and functions
.my-component {
  @include vendor.flexCenter();
  @include vendor.generateShadow(2);
}
```

### 2. 🚀 **Pre-compiled CSS**
```javascript
// ES6 import
import '@webeponto/wpf3/css';

// Or in HTML
<link rel="stylesheet" href="node_modules/@webeponto/wpf3/dist/css/wpf3.css">
```

### 3. ⚡ **TypeScript Modules**
```typescript
import { wpf } from '@webeponto/wpf3';

// Initialize components
const themes = new wpf.Themes(new wpf.Painter());
const lazyLoad = new wpf.LazyLoad();

// Theme switching
themes.switchTo('dark');

// Lazy loading images
lazyLoad.init();
```

### 4. 🔧 **Dynamic CSS Generation**
```javascript
// Copy the dynamic engine
const fs = require('fs');
const path = require('path');

// Copy render.js and wpf.config.yaml to your project
const renderPath = require.resolve('@webeponto/wpf3/dynamic/render.js');
const configPath = require.resolve('@webeponto/wpf3/config');

// Configure for your project structure
// Edit wpf.config.yaml with your directories
```

## Framework Structure

```
@webeponto/wpf3/
├── dist/
│   ├── js/               # TypeScript modules (compiled)
│   │   ├── index.js      # Main entry point
│   │   ├── index.mjs     # ES modules
│   │   └── index.d.ts    # Type definitions
│   ├── scss/             # SCSS source files
│   │   ├── index.scss    # Main SCSS entry
│   │   ├── core/         # Base styles
│   │   ├── vars/         # Variables and themes
│   │   └── wpf/          # Framework utilities
│   ├── css/              # Pre-compiled CSS
│   │   └── wpf3.css      # Complete framework
│   └── dynamic/          # Dynamic CSS engine
│       ├── render.js     # CSS generation engine
│       └── wpf.config.yaml # Configuration template
```

## Integration Examples

### Laravel/PHP
```php
// resources/scss/app.scss
@use '@webeponto/wpf3/scss' as wpf;

// Copy dynamic engine
// cp node_modules/@webeponto/wpf3/dist/dynamic/* resources/js/wpf/
```

### React/Next.js
```javascript
// styles/globals.scss
@use '@webeponto/wpf3/scss' as wpf;

// components/Layout.tsx
import { wpf } from '@webeponto/wpf3';
```

### Vue/Nuxt
```javascript
// assets/scss/main.scss
@use '@webeponto/wpf3/scss' as wpf;

// plugins/wpf3.client.js
import { wpf } from '@webeponto/wpf3';
```

## Available Classes

### Layout & Display
- `dp-flex`, `dp-grid`, `dp-block`
- `row`, `col` (contextual)
- `v-center`, `h-between`

### Spacing
- `p-20px`, `mx-15px`, `gap-10px`
- `m-auto`, `p-0px`

### Sizing
- `w-100%`, `h-50px`, `w-auto`
- `w-100px-max`, `h-50%-min`

### Typography
- `fs-16px`, `t-center`, `lh-130%`
- `tt-uppercase`, `t-nowrap`

### Effects & Animation
- `opacity-0.8`, `rotate-15deg`
- `scale-1.1`, `translate-x-10px`

## Support

- 📚 **Documentation**: [GitHub Repository](https://github.com/webeponto/wpf-sass)
- 🐛 **Issues**: [GitHub Issues](https://github.com/webeponto/wpf-sass/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/webeponto/wpf-sass/discussions)

---

**Made with ❤️ by [Webeponto](https://github.com/webeponto)**
