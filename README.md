# WPF 3.0 - The Intuitive CSS
**Dynamic utility framework that understands context, not just classes**  

```bash
npm install @webeponto/wpf3
```

## Human-First CSS for Everyone

WPF 3.0 reimagines CSS architecture by blending natural language patterns with dynamic generation. Unlike traditional frameworks:  

✅ **Intuitive syntax** - Classes that speak CSS fluently (`t-center` vs `text-align-center`)  
✅ **Context-aware rules** - Properties adapt to companion classes  
✅ **Learn-as-you-code** - Discover CSS through meaningful class names  
✅ **Zero bloat** - Generates only what your project uses  

## Quick Start

### Installation
```bash
# Install WPF3 framework
npm install @webeponto/wpf3

# Peer dependency for SCSS compilation
npm install --save-dev sass
```

### Basic Setup
```javascript
// Import TypeScript modules
import { wpf } from '@webeponto/wpf3';
const { Themes, Painter, LazyLoad } = wpf;

// Import SCSS (recommended)
@use '@webeponto/wpf3/scss' as wpf;

// Or use pre-compiled CSS
import '@webeponto/wpf3/css';
```

### Dynamic CSS Generation
```javascript
// Copy dynamic engine to your project
const render = require('@webeponto/wpf3/dynamic');
// Configure wpf.config.yaml for your project structure
```

## Why Designers and Developers Align

WPF 3.0 bridges the gap between design and development by simplifying the styling process. It allows designers to express their intent without needing to understand complex CSS rules, while developers can focus on functionality rather than class names and their attributes. Inspired by the popular Tailwind framework, and using all the power of SASS and PostCSS, WPF 3.0 provides a flexible and intuitive way to create responsive, maintainable styles.

## Key Features

While other frameworks force you to learn their language, WPF speaks *your* language:

- **PostCSS Power** - Modern features without setup  
- **SCSS Control** - Logic and variables when needed  
- **Tailwind Speed** - Rapid prototyping  
- **Human Logic** - Rules that understand relationships  

It encapsulates complex CSS concepts into simple, human-readable classes, making it easy for anyone to create beautiful, responsive designs without deep CSS knowledge, and without making the end result too overwhelming or bloated.

### For CSS Learners & Experts
```html
<!-- Discover properties through classes -->
<div class="
  absolute		/* position: absolute */
  top(50%)		/* top: 50% */
  center(v)		/* transform: translate(50%, -50%) */
  opacity-0.8	/* opacity: 0.8 */
  rotate-15deg	/* transform: rotate(15deg) */
">
```

## Contextual Intelligence Engine

WPF 3.0's engine understands the context of your classes, allowing you to write less and achieve more. It dynamically generates CSS based on the relationships between classes, so you can focus on design rather than syntax.

```html
<!-- Automatically adapts to parent context -->

<!-- Horizontal layout -->
<div class="dp-flex row v-center"></div> <!-- 'v-center' applies 'align-items:center;'> -->

<!-- Vertical layout -->
<div class="dp-flex col v-center"></div> <!-- 'v-center' applies 'justify-content:center;' -->
```

## Join and Help Us Change CSS Together!

We're building WPF with:  
🔧 **Core Team** - 3 CSS specialists
🚀 **Monthly Updates** - Since v1.0

**Contribution Opportunities:**  
- Documentation localization  
- Plugin development  
- Framework integrations (React/Vue/Svelte)  
- Performance optimization  
- Educational content  

<!-- [Contribute](https://img.shields.io/badge/PRs-Welcomed-brightgreen)
[Discord](https://img.shields.io/discord/123456789?logo=discord) -->

## License  

WPF3 is licensed under a **Modified MIT License** that protects the framework's identity while remaining open source:

✅ **FREE to use** in personal and commercial projects  
✅ **FREE to include** as a dependency in larger applications  
✅ **FREE to modify** for integration purposes  

❌ **Cannot be sold** as a standalone product  
❌ **Cannot be rebranded** or compete with WPF3  
❌ **Cannot be monetized** as an isolated service  

**Perfect for:** Websites, apps, SaaS products, client projects  
**Not allowed:** Selling WPF3 itself, creating competing frameworks  

See [LICENSE](LICENSE) for complete terms.
