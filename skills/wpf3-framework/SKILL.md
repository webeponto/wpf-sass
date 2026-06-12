---
name: wpf3-framework
description: Use this skill when working with the WPF3 (Web e Ponto Framework) CSS framework. Triggers automatically when you see WPF3 class patterns in HTML/templates (like dp-flex, t-center, p-10px, rounded-5px, v-center, h-between), @use "wpf" in SCSS files, wpf.config.yaml present in the project, import from wpf/index.ts, or when the user asks how to use, find, or write WPF3 utility classes. Also use when migrating from WPF2 to WPF3.
---

# WPF3 Framework — Reference Guide

WPF3 generates CSS dynamically from human-readable class names via a Node.js engine (`render.js`) that watches files and matches classes against regex patterns defined in `wpf.config.yaml`. The output is a `wpf-dynamic.scss` file that gets compiled with the rest of the SCSS.

## Detecting WPF3 in a Project

- `**/wpf/dynamic/render.js` — Core engine (header: `@property WPF3 - Framework CSS Dinâmico`)
- `**/wpf/dynamic/wpf.config.yaml` — Pattern config (header: `#? FRAMEWORK SCSS WPF 3`)
- `**/wpf/vendor/dynamic/wpf-dynamic.scss` — Auto-generated output (never edit)
- SCSS files with `@use "wpf/vendor"` or `@use "wpf/mods"`

## Starting the Engine

```bash
npm run wpf:watch          # Watches files and regenerates CSS on change
node path/to/render.js     # Direct invocation
```

The engine auto-reloads `wpf.config.yaml` changes. Restart required only after editing `render.js`.

## Critical WPF3 Conventions (Breaking Changes from WPF2)

| Rule | WPF2 (legacy) | WPF3 (correct) |
|------|--------------|----------------|
| Percentages require `%` | `w-100` | `w-100%` |
| Negative values | `p-30px-neg` | `p--30px` |
| Display prefix mandatory | `flex` | `dp-flex` |
| Transition timing | `ease-ease-in` | `timing-ease-in` |

**ABSOLUTE RULE**: `w-100` and `h-100` without `%` are ALWAYS WPF2 legacy. Migrate all instances.

## Class Categories & Syntax

### Display & Layout
```html
dp-flex          → display: flex; box-sizing: border-box
dp-grid          → display: grid
dp-block         → display: block
dp-flex-inline   → display: inline-flex
dp-(value)       → display: any value
```

### Contextual Flex (same class, different output based on direction)
```html
<!-- Horizontal row -->
<div class="dp-flex row v-center h-between gap-20px">
  <!-- v-center = align-items: center -->
  <!-- h-between = justify-content: space-between -->

<!-- Vertical column -->
<div class="dp-flex col v-center h-between">
  <!-- v-center = justify-content: center -->
  <!-- h-between = justify-content: space-between -->
```

**Flex alignment classes** (behavior depends on `row`/`col` mediator):
- **Vertical axis**: `v-top`, `v-center`, `v-bottom`, `v-stretch`, `v-between`
- **Horizontal axis**: `h-left`, `h-center`, `h-right`, `h-between`, `h-around`, `h-evenly`, `h-stretch`
- **Self alignment**: `vs-top`, `vs-center`, `vs-bottom`, `vs-stretch`, `hs-left`, `hs-center`, `hs-right`
- **Flex direction**: `row`, `col`, `row-reverse`/`row-r`, `col-reverse`/`col-r`
- **Flex wrap**: `wrap`, `no-wrap`/`nowrap`, `wrap-reverse`
- **Order**: `order-N`

### Grid
```html
dp-grid col-3          → 3-column grid (repeat(3, 1fr))
span-col-2             → grid-column: span 2
span-row-2             → grid-row: span 2
row-N                  → grid-template-rows: repeat(N, minmax(0, 1fr))
flow-row / flow-col / flow-dense
ltr / rtl              → direction
```

Grid alignment (`dp-grid` context): `v-top`, `v-center`, `v-bottom`, `v-stretch`, `v-baseline`, `h-left`, `h-center`, `h-right`, `h-between`, `h-stretch`

### Positioning
```html
absolute / relative / fixed / static / sticky
top(50%)    right(20px)    bottom(0%)    left(10dvh)
top(auto)   → position offset: auto
center(v)   → top: 50%; transform: translateY(-50%)
center(h)   → left: 50%; transform: translateX(-50%)
center(c)   → centered both axes
center-reset
z-10        → z-index: 10
z-(token)   → z-index: var(--token)
```

### Spacing (Padding / Margin)
```html
p-20px   px-10px   py-5rem   pt-2em   pr-5%   pb-20px   pl-10dvw
m-auto   mx-auto   my-auto   mt-auto  mr-auto  mb-auto   ml-auto
p-(token) → padding: var(--token)   [all sides/individual work the same]
```

Supported units for spacing: `px`, `em`, `rem`, `%`, `dvh`, `dvw`

### Sizing
```html
w-100%    w-50px    w-auto    w-none-min    w-none-max
w-100%-max    w-200px-min    w-(token)    w-(token)-max
h-100%    h-50dvh   h-auto   h-none-max    h-(token)
```

Supported units: `%`, `px`, `em`, `rem`, `dvw`, `dvh`, `vw`, `vh`, `ch`, `ex`

### Typography
```html
t-center  t-left  t-right  t-start  t-end  t-justify
t-underline  t-line-through  t-overline  t-none  t-wavy
t-nowrap  t-wrap  t-wrap-balance  t-wrap-pretty
tt-uppercase  tt-lowercase  tt-capitalize  tt-none
fs-16px   fs-1.5rem   fs-1em   fs-(token)
lh-130%   lh-1.5em    lh-(token)
select-none  select-all  select-text  select-auto
```

`fs-(italic|normal|oblique)` → font-style (note: overlaps with font-size prefix, use with units for size)

### Borders
```html
b-2px-solid    by-1px-dashed    bx-3px-dotted
bt-1px-solid   br-2px-double    bb-1px-solid    bl-2px-solid
b-1px          → border-width only (defaults to solid)
b-(token)      → border: var(--token)
```
Border styles: `none`, `hidden`, `dotted`, `dashed`, `solid`, `double`, `groove`, `ridge`, `inset`, `outset`

Border image: `biw-2px`, `bis-30`, `bis-30-fill`

### Border Radius
```html
rounded-8px    rounded-50%
rounded-t-8px  rounded-b-8px  rounded-l-8px  rounded-r-8px
rounded-tl-4px rounded-tr-4px rounded-bl-4px rounded-br-4px
rounded-(token)
```

### Outlines
```html
o-2px-solid                → outline: 2px solid
oc(#fff)                   → outline-color: #fff
oc(rgb(255,0,0))           → outline-color: rgb(255,0,0)   [NO SPACES]
oc(rgba(0,0,0,0.5))        → outline-color: rgba(0,0,0,0.5) [NO SPACES]
oc(token)                  → outline-color: var(--token)
oo-4px                     → outline-offset: 4px
```

### Transitions & Animation
```html
t-300ms  t-0.5s  t-(token)         → transition-duration
timing-ease  timing-ease-in-out    → transition-timing-function
delay-200ms  delay-(token)         → transition-delay
transition-all  transition-none    → transition-property
```

### Transforms
```html
scale-1.2    scale-x-0.8    scale-y-1.5    scale-z-1   scale-1.2-0.8-1
scale-(token)
rotate-45deg   rotate-x-30deg  rotate-y-15deg   rotate3d-0-1-0-45deg
rotate-(token)
translate-x-20px  translate-y-50%  translate-z-10px  translate-20px-30px
translate-x-(token)
origin-center  origin-top-left  origin-bottom-right
```

### Filters & Effects
```html
bdfx-blur-5px       → backdrop-filter: blur(5px)
bdfx-brightness-0.8
bdfx-contrast-1.2
bdfx-grayscale-0.5
bdfx-blur-(token)
blend-multiply  blend-overlay  blend-screen    → mix-blend-mode
opacity-0.5    opacity-(token)
```

### Aspect Ratio
```html
ratio-16/9   ratio-4/3   ratio-square   ratio-video   ratio-auto   ratio-1.5
ratio-(token)
```

### Object Fit & Position
```html
fit-cover   fit-contain   fit-fill   fit-none   fit-scale-down
fit-cover-top   fit-cover-bottom-left   fit-cover-center
obj-pos-center   obj-pos-top-right
obj-pos(10px,20%)   → object-position: 10px 20%
```

### Overflow
```html
overflow           → overflow: auto
overflow-hidden    overflow-scroll    overflow-visible
overflow-x         overflow-y         overflow-x-hidden   overflow-y-auto
```

### Visibility
```html
mobile   → hidden on screens ≥1024px
desktop  → hidden on screens ≤1023px
hidden   → display: none !important
```

### Other
```html
gap-20px  gap-x-10px  gap-y-5rem  gap-(token)
gap-r-10px  gap-c-10px    → row-gap / column-gap (WPF2 aliases)
z-10  z--1  z-(token)
pointer-events-none  pointer-events-all
list-disc  list-none  list-inside  list-outside
border-box  content-box
ltr  rtl
order-3
```

## Responsive Modifiers

Prefix any class with a breakpoint to make it conditional (desktop-first, `max-width`):

```html
mob:col          sm:fs-14px      md:hidden      lg:p-20px      xl:w-100%
```

Default breakpoints (configurable in `wpf.config.yaml`):
- `sm`: 576px | `md`: 650px | `lg`: 830px | `mob`: 1024px | `xl`: 1500px

Apply `!` for `!important` on any class: `!p-20px`, `mob:!t-center`

## Color Class-Functions (Static SCSS — from `_default.scss` variables)

These come from the SCSS layer, not the dynamic engine:

```html
bg(c-t1-400)        → background-color: var(--c-t1-400)
c(c-s-1)            → color: var(--c-s-1)
bc(c-border-1)      → border-color: var(--c-border-1)
f(c-t1-500)         → fill: var(--c-t1-500)
f*(c-t1-500)        → fill on all children
s(c-t1-400)         → stroke: var(--c-t1-400)
bg(transparent)     → background-color: transparent

bg(c-grad-1)        → background: var(--c-grad-1)   [gradient]
c(c-grad-1)         → gradient text clip effect
fnt(fnt-1)          → font-family: var(--fnt-1)
fnt(wgt-bold)       → font-weight: 700
fx(fx-shadow-1)     → filter: var(--fx-shadow-1)
fx(bs,fx-shadow-1)  → box-shadow: var(--fx-shadow-1)
fx(ts,fx-shadow-1)  → text-shadow: var(--fx-shadow-1)
t-fast / t-normal / t-slow  → transition: var(--t-fast/normal/slow)
mob:bg(c-bg-3)      → responsive variant
```

For raw hex colors at runtime: use the **Painter** TypeScript plugin.

## Variable Tokens (CSS Custom Properties at Runtime)

Token syntax: `utility-(token)` → `CSS-property: var(--token)`. Works with breakpoints and `!`:

```html
fs-(my-title-size)   lh-(body-lh)   p-(spacing-md)   w-(max-width)
gap-(gutter)         opacity-(ui-opacity)   rotate-(angle-var)
```

## TypeScript Runtime Modules

```typescript
import { wpf } from '@webeponto/wpf3';
const { Themes, Painter, LazyLoad, Pseudos } = wpf;

// Painter — apply hex colors from bg(#hex), c(#hex), bc(#hex)
new Painter().start();

// Pseudos — enable hover:, active:, focus:, placeholder:, group-hover:, remote-hover: prefixes
new Pseudos().start();

// LazyLoad — .wpf-lazy-load on img or div; .wpf-lazy-ignore to exclude
new LazyLoad().start(convertAllImages, allowRemoving);

// Themes — conditional classes based on active theme
// Syntax: theme.themeName[className] on element
// Activates when <html class="themeName-theme">
// theme.default[className] activates when no theme class present
const themes = new Themes(new Painter());
themes.start();
```

## SCSS Mixins Quick Reference

```scss
@use "wpf/vendor" as wpf;

@include wpf.responsive(768px, max) { ... }  // default: 1023px max
@include wpf.centerPosition('H')              // H, V, or C
@include wpf.setPosition($top, $right, $bottom, $left, $type)
@include wpf.generateGrid($columns, $gap, $min-width, $align)
@include wpf.flexCenter($direction, $justify, $align, $gap)
@include wpf.generateShadow(soft|medium|hard|glow|custom)
@include wpf.aspectRatio(16/9, modern|legacy)
@include wpf.gradientBackground(linear|radial|conic, $direction, $colors)
@include wpf.buttonStyle($bg, $text, $border, $hover-bg, ...)
@include wpf.cardStyle($background, $border, $radius, $shadow)
@include wpf.scrollbarStyle($width, $track, $thumb, $hover)
@include wpf.textGradient($gradient, $fallback)
@include wpf.shortText()
@include wpf.addVendors($property, $value)
@include wpf.container($name, $type, $axis, $pixels)
```

Animation mixins (`@use "wpf/vendor/anim"`):
`spin`, `rotate`, `ping`, `pulse`, `ping-pulse`, `bounce`, `wiggle`, `shake-x`, `shake-y`, `float`, `swing`, `tilt`, `jelly`, `flip`, `heartbeat`, `hover-glow`, `underline-sweep`, `ripple`, `shimmer`, `highlight-sweep`

## SCSS Functions Quick Reference

```scss
@use "wpf/vendor/fun" as fn;

fn.toRem(16px)                          // → 1rem
fn.toEm(24px, 16px)                     // → 1.5em
fn.stripUnit(16px)                      // → 16
fn.calculateContrast(#3b84bc)           // → #fff or #000
fn.lightenSmart(#3b84bc, 10%)
fn.darkenSmart(#3b84bc, 10%)
fn.getZIndex(modal)                     // → 400 (base/dropdown/sticky/fixed/modal/popover/tooltip/toast)
fn.fluidSize(14px, 20px, 320px, 1200px) // → clamp(...)
fn.clampSize(1rem, 2vw, 2rem)
fn.colorAlpha(#3b84bc, 0.5)
fn.getBreakpoint(md)                    // → 768px (xs/sm/md/lg/xl/xxl)
fn.generateSteps(0, 100, 5, px)
fn.randomColor(random, 70%, 50%, 1)
```

## Component System (wpf/mods)

**Button system** (`.wpf3-btn`):
- Color variants: `primary`, `secondary`, `success`, `warning`, `danger`, `dark`, `light`, `notification`
- Style variants: `outline`, `ghost`, `gradient`
- Size variants: `xs`, `sm`, `lg`, `xl`
- Effects: `ripple`, `shimmer`, `magnetic`, `glow`, `pulse`
- Group: `.wpf3-btn-group`, `.wpf3-split-btn`
- Icon-only: add `icon-only` class

```html
<button class="wpf3-btn success lg ripple">Submit</button>
<button class="wpf3-btn outline primary">Cancel</button>
```

## Adding Patterns to wpf.config.yaml

```yaml
# Independent pattern
pattern-name:
  regex: '^prefix-(\d*\.?\d+)(px|rem|%)$'
  cssTemplate: "{selector} { property: $1$2; }"

# Variable token variant (always pair with the above)
pattern-name-var:
  regex: '^prefix-\(([a-z0-9-]+)\)$'
  cssTemplate: "{selector} { property: var(--$1); }"
```

**Critical rule**: Never use `#{if()}` in cssTemplate — render.js does string replacement only, not SCSS processing. Use separate patterns when different CSS property names are needed.

## Project Integration Paths

| Ecosystem | Engine location | SCSS output |
|-----------|----------------|-------------|
| Laravel/PHP | `resources/js/wpf/dynamic/` | `resources/scss/wpf/vendor/dynamic/wpf-dynamic.scss` |
| React/Next.js | `src/js/wpf/dynamic/` or `src/utils/wpf/dynamic/` | `src/styles/wpf/vendor/dynamic/wpf-dynamic.scss` |
| Vue/Nuxt | `utils/wpf/dynamic/` | `assets/scss/wpf/vendor/dynamic/wpf-dynamic.scss` |

Update `directoriesToWatch` and `outputSCSS` in `wpf.config.yaml` for each project.
