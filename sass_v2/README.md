# ANTSAND Styles v2 - Navigation Component

## Shared CSS to Federated Sites

For reusable components such as `components/_git-history.scss`, edit Sass here and
import the component from `antsand-v2.scss`. Do not edit generated CSS or copy it
directly into a deployed website.

From the Antsand repository root, run `make build-antsand-v2`. That target runs
`make all` in `styles_antsand`, producing `styles_antsand/css/antsand-v2.css`,
then syncs the compiled CSS to Antsand's `public/css/antsand-v2.css` (along with
the other v2 assets). The equivalent CSS-only steps are
`make -C styles_antsand master` and `make -C styles_antsand sync-css-antsand`.

The federated site is a separate deployment boundary. Initial Databoard website
deployment calls `WebsiteDeployed::deploySharedFrontendAssets()`, which copies
the newest compiled `antsand-v2*.css` from the shared Antsand sources into the
generated site's `public/css/`. The site's `styles_list.json` must include
`antsand-v2` for its pages to load that file. Once deployed, the generated
`Antsand.php` runtime also checks the shared CSS SHA-256 during
`/antsand/index` and `/antsand/saveallblog` and refreshes its CSS when changed;
inspect the `X-Antsand-Styles-Sync` response header and compare the served CSS.
The Notes API save alone is not a generated-site refresh. Do not manually copy
files into the generated site or restart Docker for a Sass edit.

## Overview
This folder contains the ANTSAND v2 navigation component built with modern CSS Grid/Flexbox, replacing the old Susy/Breakpoint-based system.

## Architecture

### Old System (sass/_nav.scss)
- ❌ Susy grid (`float: left/right`)
- ❌ Breakpoint library (`@include breakpoint($tablet)`)
- ❌ Custom mixins requiring dependencies
- **Output**: 23KB CSS

### New System (sass_v2/_nav-v2.scss)
- ✅ CSS Flexbox
- ✅ CSS Grid (for wide dropdowns)
- ✅ Modern media queries
- ✅ BEM naming convention
- ✅ Semantic variables from foundation
- **Output**: 6.9KB CSS (70% smaller!)

## Files

```
sass_v2/
├── _nav-v2.scss           # Navigation component (311 lines)
├── antsand-v2-nav.scss   # Entry point for compilation
└── README.md             # This file
```

## Building

Compile the navigation component:

```bash
cd /home/antshiv/Programs/html/antsand.com/styles_antsand
sassc sass_v2/antsand-v2-nav.scss css/antsand-v2-nav.css
```

## Usage

### In HTML Templates

```html
<link rel="stylesheet" href="/css/antsand-v2-nav.css">
```

### In Volt Templates

The v2 nav is automatically available when using the nav_renderer.volt component. The CSS is included via the deployment system using styles_list.json.

### BEM Class Structure

```html
<nav class="antsand-nav-v2">
    <div class="antsand-nav-v2__logo">
        <img src="logo.png" alt="Logo">
    </div>

    <button class="antsand-nav-v2__toggle">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <ul class="antsand-nav-v2__menu">
        <li class="antsand-nav-v2__item antsand-nav-v2__item--has-dropdown">
            <a href="#">Menu Item</a>
            <ul class="antsand-nav-v2__dropdown">
                <li>
                    <a href="#">
                        <div class="antsand-nav-v2__dropdown-icon">
                            <img src="icon.svg">
                        </div>
                        <div class="antsand-nav-v2__dropdown-content">
                            <div class="antsand-nav-v2__dropdown-title">Title</div>
                            <div class="antsand-nav-v2__dropdown-description">Description</div>
                        </div>
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</nav>
```

## Theme Variants

```html
<!-- Light theme -->
<nav class="antsand-nav-v2 antsand-nav-v2--light">

<!-- Transparent -->
<nav class="antsand-nav-v2 antsand-nav-v2--transparent">

<!-- Fixed position -->
<nav class="antsand-nav-v2 antsand-nav-v2--fixed">

<!-- Sticky position -->
<nav class="antsand-nav-v2 antsand-nav-v2--sticky">
```

## Integration with ANTSAND Bootstrap

The v2 nav is registered in the deployment system:

### Location
`/app/antsand_bootstrap/project/common_styles/styles_list.json`

### Configuration
```json
{
    "antsand-v2-nav": {
        "src": "/public/builds/production/css/antsand-v2/antsand-v2-nav.css",
        "dest": "/public/css/antsand-v2-nav.css",
        "href": "/css/antsand-v2-nav.css"
    }
}
```

### To Include in Deployment

In your databoard menu configuration, add "antsand-v2-nav" to the style_list array:

```json
{
    "style_list": ["antsand-v2", "antsand-v2-nav"]
}
```

The WebsiteDeployed.php model will:
1. Read styles_list.json
2. Copy antsand-v2-nav.css from src to dest
3. Add `<link rel='stylesheet' href='/css/antsand-v2-nav.css'>` to the page

## Backward Compatibility

The v2 nav includes legacy class mappings via `@extend`:

```scss
.antsand-nav-style {
    @extend .antsand-nav-v2;
}

.nav_bar {
    @extend .antsand-nav-v2;
}

.module_left {
    @extend .antsand-nav-v2__logo;
}
```

This allows existing templates using `.antsand-nav-style` to automatically use v2 styles.

## Variables Used

From `/foundation/_variables.scss`:

- **Spacing**: `$antsand-space-1` through `$antsand-space-8`
- **Colors**: `$antsand-gray-*`, `$antsand-primary`
- **Breakpoints**: `$antsand-breakpoint-sm/md/lg/xl`
- **Shadows**: `$antsand-shadow-sm/md/lg/xl`
- **Transitions**: `$antsand-transition-base`
- **Z-index**: `$antsand-z-dropdown`, `$antsand-z-fixed`

## Future Components

Follow this pattern for other v2 components:

```
sass_v2/
├── _nav-v2.scss           ✅ Done
├── _accordion-v2.scss     📋 TODO
├── _carousel-v2.scss      📋 TODO
├── _grid-v2.scss          📋 TODO
├── _footer-v2.scss        📋 TODO
└── ...
```

Each component should:
1. Use modern CSS (Grid/Flexbox)
2. Follow BEM naming
3. Use semantic variables from foundation
4. Be mobile-first responsive
5. Include theme variants
6. Have backward compatibility via @extend
