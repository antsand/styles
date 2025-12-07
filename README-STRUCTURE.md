# ANTSAND v2 - Complete Structure

## 🎯 DEPLOYMENT ARCHITECTURE

### Single Source of Truth
All files flow to **ONE location**: `styles/public/builds/production/`

```
styles_antsand/sass_v2/  →  [compile]  →  styles_antsand/css/
                                              ↓
                                           [sync]
                                              ↓
                              styles/public/builds/production/  ← SINGLE SOURCE
                                   ↓                    ↓
                              [preview UI]      [deployment copy]
                                   ↓                    ↓
                          Render in browser    Deployed websites
```

**Why this matters:**
- ✅ Preview UI and deployed sites use **IDENTICAL** CSS files
- ✅ No intermediate copies to `app/antsand_bootstrap/`
- ✅ No version mismatches or sync issues
- ✅ One place to update, everywhere gets the change

## ✅ Everything is now in `sass_v2/`

All SCSS source files, organized folders, and v2 components are now centralized in the `sass_v2/` directory.

## Directory Structure

```
styles_antsand/
├── sass_v2/                          # ALL v2 source files
│   ├── antsand.scss                  # Master file (imports everything)
│   ├── antsand-v2-fonts.scss         # Fonts (standalone)
│   ├── antsand-v2-nav.scss           # Navigation (standalone)
│   ├── antsand-v2-tabs-refactored.scss  # Tabs (standalone)
│   │
│   ├── foundation/                   # Base styles
│   │   ├── _variables.scss
│   │   ├── _reset.scss
│   │   ├── _mixins.scss
│   │   └── _utilities.scss
│   │
│   ├── layout/                       # Layout systems
│   │   ├── _grid.scss
│   │   └── _section.scss
│   │
│   ├── components/                   # UI components
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   ├── _forms.scss
│   │   ├── _accordion.scss
│   │   ├── _tabs.scss
│   │   ├── _modal.scss
│   │   ├── _navbar.scss
│   │   ├── _dropdown.scss
│   │   ├── _alert.scss
│   │   ├── _badge.scss
│   │   ├── _breadcrumb.scss
│   │   ├── _typography.scss
│   │   └── _callout.scss
│   │
│   ├── patterns/                     # Common patterns
│   │   ├── _hero.scss
│   │   ├── _features.scss
│   │   ├── _pricing.scss
│   │   └── _footer.scss
│   │
│   ├── themes/                       # Theme variations
│   │   └── _modern.scss
│   │
│   └── _*.scss                       # Component partials
│
├── css/                              # Compiled CSS output
│   ├── antsand.css                   # Compiled master file
│   ├── antsand-v2-fonts.css          # Compiled fonts
│   ├── antsand-v2-nav.css            # Compiled navigation
│   └── antsand-v2-tabs.css           # Compiled tabs
│
├── js/                               # JavaScript
│   └── antsand.js                    # Universal component JS
│
└── Makefile                          # Build system

```

## Build System (Makefile)

### Commands

```bash
# Compile everything
make all

# Compile individual components
make fonts
make nav
make tabs
make master

# Clean compiled files
make clean

# Watch and auto-compile
make watch

# Show help
make help
```

## What Each File Does

### Master File
- **`antsand.scss`** - Imports foundation, components, layout, patterns, themes
  - Compiles to: `css/antsand.css`
  - Use when you need the complete framework

### Standalone Components (v2)
- **`antsand-v2-fonts.scss`** - Complete font library (58 font families, 151 @font-face declarations)
  - Includes: Google Fonts (Inter, Roboto) + comprehensive local fonts via `_fonts-v2.scss`
  - Local fonts use `/fonts/` paths (served by nginx from `/public/fonts/`)
  - **39 utility classes** via `_font-utilities.scss` for easy font application
  - Compiles to: `css/antsand-v2-fonts.css` (1097 lines, 43KB)
  - Use in parameter files: `"styles": ["antsand-v2-fonts"]`
  - **Usage example**: `<h1 class="font-Graphik">Heading</h1>`

- **`antsand-v2-nav.scss`** - Just navigation
  - Compiles to: `css/antsand-v2-nav.css`
  - Use in parameter files: `"styles": ["antsand-v2-fonts", "antsand-v2-nav"]`

- **`antsand-v2-tabs-refactored.scss`** - Just tabs (5 variants)
  - Compiles to: `css/antsand-v2-tabs.css`
  - Use in parameter files: `"styles": ["antsand-v2-fonts", "antsand-v2-tabs"]`

## Workflow

### 1. Development (in styles_antsand/)

```bash
# Edit files in sass_v2/
vim sass_v2/antsand-v2-nav.scss

# Compile
make nav

# Or compile everything
make all
```

### 2. Sync to Documentation Site (in styles/)

```bash
cd ../styles
make sync
```

This syncs **only** `antsand-v2-*.css` files from `styles_antsand/css/` to `styles/public/builds/production/css/antsand-v2/`

### 3. Result

Files are available at:
- `/builds/production/css/antsand-v2/antsand-v2-fonts.css`
- `/builds/production/css/antsand-v2/antsand-v2-nav.css`
- `/builds/production/css/antsand-v2/antsand-v2-tabs.css`

## Parameter Files

### Header Example
```json
{
  "name": "Header 1",
  "phalcon_template": "/databoard/views/layouts/header_renderer.volt",
  "styles": [
    "antsand-v2-fonts",
    "antsand-v2-nav"
  ],
  "parameters_file": "header_1_modern"
}
```

### Tabs Example
```json
{
  "name": "Tabs Pills",
  "phalcon_template": "/databoard/views/layouts/tabs_renderer_refactored.volt",
  "styles": [
    "antsand-v2-fonts",
    "antsand-v2-tabs"
  ],
  "parameters_file": "tabs_pills_modern"
}
```

## Benefits

### ✅ Centralized
- Everything in one place: `sass_v2/`
- No scattered files

### ✅ Organized
- Clear folder structure
- Easy to find files

### ✅ Flexible
- Compile master file (everything)
- Or compile individual components
- Mix and match in parameter files

### ✅ Clean
- v2 files clearly named with `antsand-v2-` prefix
- Standalone components focused on one purpose
- No dependencies between components (except fonts)

## Migration from Legacy

### Before
```
styles_antsand/
├── sass/           # Legacy partials
├── components/     # Some components
├── foundation/     # Some foundation
├── antsand.scss    # Root level
└── (mixed structure)
```

### After
```
styles_antsand/
├── sass_v2/                    # Everything here!
│   ├── antsand.scss
│   ├── foundation/
│   ├── components/
│   ├── layout/
│   ├── patterns/
│   ├── themes/
│   └── antsand-v2-*.scss
└── css/                        # Compiled output
```

## Adding New Components

### 1. Create Component File
```bash
vim sass_v2/antsand-v2-buttons.scss
```

### 2. Add to Makefile
```makefile
V2_BUTTONS = $(SASS_V2_DIR)/antsand-v2-buttons.scss
CSS_BUTTONS = $(CSS_DIR)/antsand-v2-buttons.css

buttons:
	@sassc $(V2_BUTTONS) $(CSS_BUTTONS)
```

### 3. Compile
```bash
make buttons
```

### 4. Sync
```bash
cd ../styles && make sync
```

### 5. Use in Parameter Files
```json
{
  "styles": [
    "antsand-v2-fonts",
    "antsand-v2-buttons"
  ]
}
```

## Path Resolution

In `renderer.module.js`:
```javascript
if (styleName.startsWith('antsand-v2-')) {
    return `/builds/production/css/antsand-v2/${styleName}.css`;
} else {
    return `/builds/production/css/${styleName}.css`;
}
```

**Result:**
- `antsand-v2-fonts` → `/css/antsand-v2/antsand-v2-fonts.css` ✓
- `antsand-v2-nav` → `/css/antsand-v2/antsand-v2-nav.css` ✓
- `antsand-fonts` → `/css/antsand-fonts.css` (legacy) ✓

## Deployment Workflow

### 1. Compile in styles_antsand/
```bash
cd styles_antsand
make all           # Compile all SCSS files to css/ directory
```

This compiles:
- `sass_v2/antsand-v2.scss` → `css/antsand-v2.css` (master file with all components)
- `sass_v2/antsand-v2-fonts.scss` → `css/antsand-v2-fonts.css`
- `sass_v2/antsand-v2-nav.scss` → `css/antsand-v2-nav.css`
- `sass_v2/antsand-v2-tabs-refactored.scss` → `css/antsand-v2-tabs.css`

### 2. Sync to Production (styles/)
```bash
cd ../styles
make sync          # Copy v2 CSS, JS, and fonts to production
```

This copies:
- `styles_antsand/css/antsand-v2*.css` → `styles/public/builds/production/css/antsand-v2/`
  - Includes: `antsand-v2.css`, `antsand-v2-fonts.css`, `antsand-v2-nav.css`, `antsand-v2-tabs.css`
- `styles_antsand/antsand.js` → `styles/public/builds/production/js/`
- `styles_antsand/fonts/*` → `styles/public/builds/production/fonts/`

### 3. Deployment to Websites

When a website is deployed via `WebsiteDeployed.php`, it reads `styles_list.json` and:

1. **For CSS files** (object format with `src`, `dest`, `href`):
   - Copies file from `src` (production path) to deployed site's `dest`
   - Creates `<link>` tag with `href` in common_styles file

2. **For directories** (object format with `type: "directory"`):
   - Recursively copies entire directory from `src` to `dest`
   - No `<link>` tag (used for fonts, assets)

3. **For external URLs** (string format):
   - Creates `<link>` tag directly to external URL
   - No file copy (legacy styles hosted externally)

### styles_list.json Format

```json
{
  "antsand-v2": {
    "src": "/public/builds/production/css/antsand-v2/antsand-v2.css",
    "dest": "/public/css/antsand-v2.css",
    "href": "/css/antsand-v2.css"
  },
  "antsand-v2-fonts": {
    "src": "/public/builds/production/css/antsand-v2/antsand-v2-fonts.css",
    "dest": "/public/css/antsand-v2-fonts.css",
    "href": "/css/antsand-v2-fonts.css"
  },
  "antsand-v2-fonts-directory": {
    "src": "/public/builds/production/fonts/",
    "dest": "/public/fonts/",
    "type": "directory"
  },
  "antsand-fonts": "https://styles.antsand.com/builds/production/css/antsand-fonts.css"
}
```

**Path Resolution:**
- `src` paths are relative to antsand.com repo root (`/home/antshiv/Programs/html/antsand.com`)
- During deployment, `WebsiteDeployed.php` adds `$config->paths->basePath . '/..'` prefix
- Example: `/public/builds/production/css/...` → `/home/antshiv/Programs/html/antsand.com/styles/public/builds/production/css/...`

## Font Utility Classes

ANTSAND v2 includes 39 utility classes for quick font-family application without writing custom CSS.

### Usage

Simply add a class to any HTML element:

```html
<h1 class="font-Graphik">Modern Heading</h1>
<p class="font-Inter">Body text content</p>
<div class="font-PlayfairDisplay">Elegant serif design</div>
<span class="font-Caveat">Handwritten style</span>
```

### Available Classes (39 total)

**Sans-Serif:**
- `.font-Graphik`, `.font-Inter`, `.font-Futura`, `.font-Avenir`
- `.font-Gotham`, `.font-ProximaNova`, `.font-Akkurat`, `.font-Montserrat`
- `.font-Retina`, `.font-SalvoSans`, `.font-Guardian`, `.font-LotaGrotesque`
- `.font-Novecento`, `.font-NovecentoWide`, `.font-Oswald`, `.font-BrandonGrotesque`
- `.font-HelveticaNeue`, `.font-ArtifaktElement`, `.font-MaisonNeue`

**Serif:**
- `.font-FreightTextPro`, `.font-PlayfairDisplay`, `.font-Merriweather`
- `.font-Cinzel`, `.font-GoudyOldStyle`, `.font-PrestigeSignature`

**Display:**
- `.font-Boing`, `.font-Coluna`, `.font-Boxout`, `.font-BebasNeue`
- `.font-GHGuardianHeadline`

**Script/Decorative:**
- `.font-Caveat`, `.font-HaveHeart`, `.font-Sacramento`, `.font-CooperLight`

**Monospace:**
- `.font-DejaVuSansMono`, `.font-Inconsolata`, `.font-GoMono`

**Slab Serif:**
- `.font-RobotoSlab`, `.font-ZillaSlab`

### Helper Class

- `.alphabet` - Styled class for showing font sample alphabets (gray text, smaller size)

### Example HTML

```html
<link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand-v2-fonts.css">

<div class="font-demo">
    <h2 class="font-Boing">Display Heading</h2>
    <p class="font-Inter">This is body text using Inter font.</p>
    <div class="alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</div>
</div>
```

## Summary

🎯 **All v2 source files are in `sass_v2/`**
🎯 **Organized folders inside `sass_v2/`**
🎯 **Makefile compiles from `sass_v2/` to `css/`**
🎯 **Sync copies from `styles_antsand` to `styles/public/builds/production/`**
🎯 **styles_list.json controls deployment to individual websites**
🎯 **WebsiteDeployed.php handles directory copying (fonts) and file copying (CSS)**
🎯 **Clean, maintainable, scalable structure**
