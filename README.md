# ANTSAND Styles v2

**Modern CSS library with Bootstrap philosophy, not Tailwind chaos**

## Philosophy

```
❌ Tailwind (Inconsistent):
<button class="px-4 py-2 bg-blue-500">Button 1</button>
<button class="px-7 py-3 bg-blue-600">Button 2</button>  ← Different everywhere

✅ ANTSAND (Consistent):
<button class="antsand-btn-primary">Button 1</button>
<button class="antsand-btn-primary">Button 2</button>  ← SAME everywhere
```

**Semantic classes that describe purpose, not pixels.**

## Features

- ✅ **Bootstrap philosophy** - Semantic classes, consistent design system
- ✅ **Modern CSS** - Grid, Flexbox (no float!)
- ✅ **No bloat** - Only what templates need
- ✅ **Platform agnostic** - Works anywhere (web, watch, IoT, dashboard)
- ✅ **Customizable** - SASS variables, easy theming

## Installation

### Build from source:
```bash
make build-antsand-v2
```

### Use compiled CSS:
```html
<!-- Full library -->
<link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand.css">

<!-- Or just core (foundation + layout) -->
<link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand-core.css">
```

## Components

### Buttons
```html
<!-- Sizes -->
<button class="antsand-btn antsand-btn-primary">Default</button>
<button class="antsand-btn antsand-btn-primary antsand-btn-sm">Small</button>
<button class="antsand-btn antsand-btn-primary antsand-btn-lg">Large</button>

<!-- Variants -->
<button class="antsand-btn antsand-btn-primary">Primary</button>
<button class="antsand-btn antsand-btn-secondary">Secondary</button>
<button class="antsand-btn antsand-btn-success">Success</button>
<button class="antsand-btn antsand-btn-danger">Danger</button>

<!-- Outline -->
<button class="antsand-btn antsand-btn-outline-primary">Outline</button>

<!-- Block -->
<button class="antsand-btn antsand-btn-primary antsand-btn-block">Full Width</button>

<!-- Pill -->
<button class="antsand-btn antsand-btn-primary antsand-btn-pill">Pill Shape</button>
```

### Forms
```html
<div class="antsand-form-group">
    <label class="antsand-form-label">Email</label>
    <input type="email" class="antsand-form-control" placeholder="you@example.com">
    <small class="antsand-form-text">We'll never share your email.</small>
</div>

<div class="antsand-form-group">
    <label class="antsand-form-label">Message</label>
    <textarea class="antsand-form-control"></textarea>
</div>

<div class="antsand-form-check">
    <input type="checkbox" id="agree">
    <label for="agree">I agree to terms</label>
</div>
```

### Cards
```html
<div class="antsand-card antsand-card-shadow">
    <img src="image.jpg" class="antsand-card-img">
    <div class="antsand-card-body">
        <h3 class="antsand-card-title">Card Title</h3>
        <p class="antsand-card-text">Card description text goes here.</p>
        <button class="antsand-btn antsand-btn-primary">Learn More</button>
    </div>
</div>
```

### Grid
```html
<!-- CSS Grid (no float!) -->
<div class="antsand-grid antsand-grid-3">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>

<!-- Auto-responsive (no media queries needed!) -->
<div class="antsand-grid antsand-grid-auto">
    <div>Auto Item 1</div>
    <div>Auto Item 2</div>
    <div>Auto Item 3</div>
</div>

<!-- Flexbox -->
<div class="antsand-flex antsand-flex-between">
    <div>Left</div>
    <div>Right</div>
</div>
```

### Container
```html
<!-- Responsive container -->
<div class="antsand-container">
    Content here
</div>

<!-- Fluid container -->
<div class="antsand-container-fluid">
    Full width content
</div>
```

### Sections
```html
<!-- Standard section -->
<section class="antsand-section">
    Content
</section>

<!-- Small section -->
<section class="antsand-section-sm">
    Less padding
</section>

<!-- Large section -->
<section class="antsand-section-lg">
    More padding
</section>

<!-- Background variants -->
<section class="antsand-section antsand-section-light">
    Light background
</section>

<section class="antsand-section antsand-section-dark">
    Dark background
</section>

<section class="antsand-section antsand-section-primary">
    Primary color background
</section>
```

## Customization

Edit SASS variables in `foundation/_variables.scss`:

```scss
// Colors
$antsand-primary: #3498db !default;
$antsand-secondary: #2c3e50 !default;

// Spacing
$antsand-space-3: 1rem !default;  // Base spacing

// Typography
$antsand-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto !default;
$antsand-font-size-base: 1rem !default;

// Border radius
$antsand-radius-md: 0.5rem !default;

// Breakpoints
$antsand-breakpoint-md: 768px !default;
$antsand-breakpoint-lg: 1024px !default;
```

Then rebuild:
```bash
make build-antsand-v2
```

## File Structure

```
styles_antsand/
├── foundation/
│   ├── _variables.scss   # Customization point
│   ├── _reset.scss        # Modern CSS reset
│   └── _mixins.scss       # Reusable mixins
├── layout/
│   ├── _grid.scss         # Grid + Flexbox
│   └── _section.scss      # Section wrappers
├── components/
│   ├── _buttons.scss      # Button styles
│   ├── _cards.scss        # Card component
│   └── _forms.scss        # Form elements
├── patterns/              # Coming soon
│   ├── _header.scss       # Header layouts
│   ├── _hero.scss         # Hero sections
│   └── _features.scss     # Feature layouts
├── antsand.scss           # Full library
└── antsand-core.scss      # Core only (no components)
```

## Build Commands

```bash
# Build ANTSAND v2
make build-antsand-v2

# Build everything (ANTSAND v2 + databoard JS/SASS)
make build-modern

# Watch for changes and auto-rebuild
make watch-modern

# Clean compiled files
make clean-antsand-v2
```

## Integration with ANTSAND Templates

Use in parameter files:

```json
{
  "header-style-1": {
    "phalcon_template": "/common_views/services_products/service_3_modern.volt",
    "css": {
      "header": {
        "section": {"css_class": "antsand-section antsand-section-dark"}
      }
    },
    "styles": [
      "/builds/production/css/antsand-v2/antsand.css"
    ]
  }
}
```

## Why Not Tailwind?

**ANTSAND uses a two-tier system — not Tailwind, not just Bootstrap.**

### Tier 1: Semantic Classes (Primary — Design Identity)
One root class + descendant selectors. This is the ANTSAND way.

```html
<!-- ✅ ANTSAND — Consistent, reusable, semantic -->
<div class="pricing-grid">
  <div class="antsand-card antsand-card-shadow">
    <h3 class="antsand-card-title">Plan Name</h3>
    <p class="antsand-card-text">Description</p>
    <button class="antsand-btn antsand-btn-primary">Choose</button>
  </div>
</div>
```

### Tier 2: Utility Classes (Modifier — Fine-tuning)
Augment semantic fields, never replace them. Available in `antsand-v2.css`.

```html
<!-- ✅ Utilities AUGMENT semantic structure -->
<div class="pricing-grid">
  <div class="antsand-card shadow transition-all hover:-translate-y-1">
    <div class="aspect-video"><img class="object-cover" /></div>
    <h3 class="antsand-card-title line-clamp-2">Title</h3>
    <p class="antsand-card-text line-clamp-3 opacity-75">Excerpt</p>
    <button class="antsand-btn antsand-btn-primary">Read More</button>
  </div>
</div>

<!-- ❌ WRONG — pure utilities without semantic identity -->
<div class="flex flex-wrap gap-4 p-8 bg-white rounded-lg shadow-lg">
  ...no design identity, inconsistent across site...
</div>
```

### Available Utility Classes

| Category | Classes |
|----------|---------|
| **Spacing** | `p-1`..`p-8`, `px-*`, `py-*`, `m-1`..`m-8`, `mx-auto`, `gap-1`..`gap-8` |
| **Display** | `block`, `hidden`, `flex`, `grid`, `inline`, `inline-flex` |
| **Flexbox** | `flex-row`, `flex-col`, `flex-wrap`, `items-center`, `justify-between`, `justify-center` |
| **Typography** | `text-sm`..`text-5xl`, `font-bold`, `font-semibold`, `text-center`, `text-left`, `text-right` |
| **Line Clamp** | `line-clamp-1`..`line-clamp-5`, `truncate` |
| **Borders** | `rounded`, `rounded-lg`, `rounded-full`, `border`, `border-0` |
| **Shadows** | `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl` |
| **Opacity** | `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100` |
| **Aspect Ratio** | `aspect-video` (16:9), `aspect-square` (1:1), `aspect-photo` (4:3), `aspect-portrait` (3:4) |
| **Object Fit** | `object-cover`, `object-contain`, `object-center`, `object-top`, `object-bottom` |
| **Transitions** | `transition-all`, `transition-colors`, `transition-opacity`, `duration-150`..`duration-500`, `ease-in-out` |
| **Hover** | `hover:scale-105`, `hover:-translate-y-1`, `hover:shadow-lg`, `hover:opacity-100` |
| **Backdrop** | `backdrop-blur`, `backdrop-blur-lg`, `bg-white/85`, `bg-black/50` |
| **Divide** | `divide-y`, `divide-x`, `space-y-1`..`space-y-8`, `space-x-1`..`space-x-6` |
| **Focus/Ring** | `ring`, `ring-primary`, `focus:ring`, `focus-visible:ring` |
| **Responsive** | `sm:*`, `md:*`, `lg:*` prefixes for display, grid, flex, spacing, text |
| **Animation** | `animate-fade-in`, `animate-slide-up`, `animate-spin`, `animate-pulse` |
| **Scroll** | `scroll-smooth`, `snap-x`, `snap-start`, `scrollbar-hide` |
| **Height** | `min-h-screen`, `max-h-[500px]`, `h-screen`, `h-[50vh]` |
| **Whitespace** | `whitespace-nowrap`, `whitespace-pre-wrap`, `break-words` |

### When to Use What

| Use Case | Tier | Example |
|----------|------|---------|
| Design pattern for a section | **Tier 1** | `.project-showcase { .data-sub-container { ... } }` |
| Card hover lift effect | **Tier 2** | `transition-all hover:-translate-y-1 hover:shadow-lg` |
| Grid column count | **Tier 1** | `antsand-grid-3` or root class with grid rules |
| Responsive grid override | **Tier 2** | `md:grid-cols-3 lg:grid-cols-4` |
| Truncate excerpt text | **Tier 2** | `line-clamp-3` |
| Image container ratio | **Tier 2** | `aspect-video object-cover` |
| Section background | **Tier 1** | `antsand-section-dark` |
| Frosted glass overlay | **Tier 2** | `backdrop-blur bg-white/85` |

### In Databoard Context

When the Databoard agent styles a section:
1. **Root class** (Tier 1) → defines the section's design identity in SCSS
2. **Field modifiers** (Tier 2) → utility classes on individual Databoard fields

```
data.container    = "project-showcase antsand-grid-3 md:gap-6"     ← root + responsive
data.sub_container = "antsand-card shadow transition-all"           ← semantic + modifier
data.img_container = "aspect-video"                                 ← utility
data.h3           = "line-clamp-2 md:text-xl"                      ← utility
data.p            = "line-clamp-3 opacity-75"                       ← utility
data.cta          = "antsand-btn antsand-btn-primary"              ← pure semantic
```

## License

MIT - Use anywhere, modify freely

## Future (styles.antsand.com/v2)

This library will evolve into standalone package at `styles.antsand.com/v2`:
- Own npm package
- Own documentation site
- Anyone can use it (not just ANTSAND projects)

For now, it lives in ANTSAND project for rapid iteration and real-world testing.
