# ANTSAND Styles v2 - Complete Documentation

**Modern CSS library with Bootstrap philosophy, not Tailwind chaos**

## 📋 Table of Contents

- [Philosophy](#philosophy)
- [Installation](#installation)
- [Components](#components)
  - [Buttons](#buttons)
  - [Forms](#forms)
  - [Cards](#cards)
  - [Accordion](#accordion)
  - [Tabs](#tabs)
  - [Modal](#modal)
  - [Navbar](#navbar)
  - [Dropdown](#dropdown)
  - [Alert](#alert)
  - [Badge](#badge)
  - [Breadcrumb](#breadcrumb)
- [Layout](#layout)
  - [Grid System](#grid-system)
  - [Container](#container)
  - [Sections](#sections)
- [Patterns](#patterns)
  - [Hero](#hero)
  - [Features](#features)
  - [Pricing](#pricing)
  - [Footer](#footer)
- [Utilities](#utilities)
- [JavaScript](#javascript)
- [Customization](#customization)

---

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

## Installation

### Include CSS and JavaScript

```html
<!-- CSS -->
<link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand.css">

<!-- JavaScript (for interactive components) -->
<script src="/path/to/antsand.js"></script>
```

### Build from Source

```bash
make build-antsand-v2
```

---

## Components

### Buttons

Consistent button styles with clear semantic variants.

#### Basic Usage

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
<button class="antsand-btn antsand-btn-warning">Warning</button>

<!-- Outline -->
<button class="antsand-btn antsand-btn-outline-primary">Outline</button>

<!-- Block Button -->
<button class="antsand-btn antsand-btn-primary antsand-btn-block">Full Width</button>

<!-- Pill Shape -->
<button class="antsand-btn antsand-btn-primary antsand-btn-pill">Pill</button>
```

#### Classes

- `.antsand-btn` - Base button class (required)
- `.antsand-btn-{variant}` - Color variants (primary, secondary, success, danger, warning, light, dark)
- `.antsand-btn-outline-{variant}` - Outline variants
- `.antsand-btn-sm` / `.antsand-btn-lg` - Size modifiers
- `.antsand-btn-block` - Full-width button
- `.antsand-btn-pill` - Pill-shaped button

---

### Forms

Consistent form styling with validation states.

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

<!-- Validation States -->
<input type="text" class="antsand-form-control is-valid">
<div class="antsand-valid-feedback">Looks good!</div>

<input type="text" class="antsand-form-control is-invalid">
<div class="antsand-invalid-feedback">Please provide a valid input.</div>
```

#### Classes

- `.antsand-form-group` - Form field wrapper
- `.antsand-form-label` - Form label
- `.antsand-form-control` - Input/textarea/select
- `.antsand-form-check` - Checkbox/radio wrapper
- `.antsand-form-text` - Helper text
- `.is-valid` / `.is-invalid` - Validation states
- `.antsand-valid-feedback` / `.antsand-invalid-feedback` - Validation messages

---

### Cards

Card components for content containers.

```html
<div class="antsand-card antsand-card-shadow">
    <img src="image.jpg" class="antsand-card-img">
    <div class="antsand-card-body">
        <h3 class="antsand-card-title">Card Title</h3>
        <p class="antsand-card-text">Card description goes here.</p>
        <button class="antsand-btn antsand-btn-primary">Learn More</button>
    </div>
</div>

<!-- With Header and Footer -->
<div class="antsand-card antsand-card-shadow">
    <div class="antsand-card-header">
        <h4>Header</h4>
    </div>
    <div class="antsand-card-body">
        <p>Content</p>
    </div>
    <div class="antsand-card-footer">
        <button class="antsand-btn antsand-btn-primary">Action</button>
    </div>
</div>
```

#### Classes

- `.antsand-card` - Base card
- `.antsand-card-shadow` - Add shadow
- `.antsand-card-header` / `.antsand-card-body` / `.antsand-card-footer` - Card sections
- `.antsand-card-img` - Card image
- `.antsand-card-title` / `.antsand-card-text` - Typography

---

### Accordion

Collapsible content panels.

```html
<div class="antsand-accordion">
    <div class="antsand-accordion-item">
        <button class="antsand-accordion-header">
            <span>Section 1</span>
            <span class="antsand-accordion-icon"></span>
        </button>
        <div class="antsand-accordion-body">
            <div class="antsand-accordion-content">
                <p>Content for section 1</p>
            </div>
        </div>
    </div>

    <div class="antsand-accordion-item">
        <button class="antsand-accordion-header">
            <span>Section 2</span>
            <span class="antsand-accordion-icon"></span>
        </button>
        <div class="antsand-accordion-body">
            <div class="antsand-accordion-content">
                <p>Content for section 2</p>
            </div>
        </div>
    </div>
</div>
```

**JavaScript**: Auto-initialized. Closes other items when one is opened.

---

### Tabs

Tab navigation for content sections.

```html
<div class="antsand-tabs">
    <div class="antsand-tab-nav">
        <button class="antsand-tab-item active">Tab 1</button>
        <button class="antsand-tab-item">Tab 2</button>
        <button class="antsand-tab-item">Tab 3</button>
    </div>

    <div class="antsand-tab-content">
        <div class="antsand-tab-pane active">
            <p>Content 1</p>
        </div>
        <div class="antsand-tab-pane">
            <p>Content 2</p>
        </div>
        <div class="antsand-tab-pane">
            <p>Content 3</p>
        </div>
    </div>
</div>

<!-- Pills Variant -->
<div class="antsand-tabs">
    <div class="antsand-tab-nav antsand-tab-nav-pills">
        <!-- tabs -->
    </div>
</div>

<!-- Vertical Tabs -->
<div class="antsand-tabs antsand-tabs-vertical">
    <!-- tabs -->
</div>
```

**JavaScript**: Auto-initialized.

---

### Modal

Overlay dialog component.

```html
<!-- Trigger -->
<button data-modal-open="myModal" class="antsand-btn antsand-btn-primary">
    Open Modal
</button>

<!-- Modal -->
<div class="antsand-modal" id="myModal">
    <div class="antsand-modal-dialog">
        <div class="antsand-modal-header">
            <h3>Modal Title</h3>
            <button class="antsand-modal-close" data-modal-close>&times;</button>
        </div>
        <div class="antsand-modal-body">
            <p>Modal content goes here.</p>
        </div>
        <div class="antsand-modal-footer">
            <button class="antsand-btn antsand-btn-secondary" data-modal-close>Close</button>
            <button class="antsand-btn antsand-btn-primary">Save</button>
        </div>
    </div>
</div>

<!-- Size Variants -->
<div class="antsand-modal antsand-modal-sm"><!-- Small --></div>
<div class="antsand-modal antsand-modal-lg"><!-- Large --></div>
<div class="antsand-modal antsand-modal-xl"><!-- Extra Large --></div>
<div class="antsand-modal antsand-modal-fullscreen"><!-- Fullscreen --></div>
```

**JavaScript**:
- Opens with `data-modal-open="modalId"`
- Closes with `data-modal-close`, ESC key, or backdrop click

---

### Navbar

Navigation bar with mobile toggle.

```html
<nav class="antsand-navbar">
    <a href="#" class="antsand-navbar-brand">
        <img src="logo.svg" alt="Logo">
        Brand
    </a>

    <ul class="antsand-navbar-nav">
        <li><a href="#" class="antsand-navbar-item active">Home</a></li>
        <li><a href="#" class="antsand-navbar-item">About</a></li>
        <li><a href="#" class="antsand-navbar-item">Services</a></li>
        <li><a href="#" class="antsand-navbar-item">Contact</a></li>
    </ul>

    <button class="antsand-navbar-toggle">
        <span class="antsand-navbar-toggle-icon">
            <span></span>
            <span></span>
            <span></span>
        </span>
    </button>
</nav>

<!-- Variants -->
<nav class="antsand-navbar antsand-navbar-dark"><!-- Dark --></nav>
<nav class="antsand-navbar antsand-navbar-primary"><!-- Primary Color --></nav>
<nav class="antsand-navbar antsand-navbar-fixed"><!-- Fixed Top --></nav>
```

**JavaScript**: Auto-initialized mobile toggle.

---

### Dropdown

Dropdown menu component.

```html
<div class="antsand-dropdown">
    <button class="antsand-dropdown-toggle">
        Dropdown Menu
    </button>
    <div class="antsand-dropdown-menu">
        <div class="antsand-dropdown-header">Header</div>
        <a href="#" class="antsand-dropdown-item">Action 1</a>
        <a href="#" class="antsand-dropdown-item active">Action 2</a>
        <div class="antsand-dropdown-divider"></div>
        <a href="#" class="antsand-dropdown-item">Action 3</a>
    </div>
</div>

<!-- Right Aligned -->
<div class="antsand-dropdown">
    <button class="antsand-dropdown-toggle">Dropdown</button>
    <div class="antsand-dropdown-menu antsand-dropdown-menu-right">
        <!-- items -->
    </div>
</div>

<!-- Dropup -->
<div class="antsand-dropdown antsand-dropup">
    <!-- items -->
</div>
```

**JavaScript**: Auto-initialized. Closes on outside click.

---

### Alert

Alert/notification messages.

```html
<!-- Success Alert -->
<div class="antsand-alert antsand-alert-success">
    <span class="antsand-alert-icon">✓</span>
    <div class="antsand-alert-content">
        <strong>Success!</strong> Your action was completed.
    </div>
</div>

<!-- Dismissible Alert -->
<div class="antsand-alert antsand-alert-warning">
    <span class="antsand-alert-icon">⚠</span>
    <div class="antsand-alert-content">
        <strong>Warning!</strong> Please review this message.
    </div>
    <button class="antsand-alert-close">&times;</button>
</div>

<!-- Variants: primary, secondary, success, danger, warning, info, light, dark -->
```

**JavaScript**: Auto-initialized dismissible alerts.

---

### Badge

Small label/count indicators.

```html
<!-- Basic Badge -->
<span class="antsand-badge antsand-badge-primary">New</span>
<span class="antsand-badge antsand-badge-success">Success</span>
<span class="antsand-badge antsand-badge-danger">5</span>

<!-- Pill Badge -->
<span class="antsand-badge antsand-badge-primary antsand-badge-pill">Pill</span>

<!-- Outline Badge -->
<span class="antsand-badge antsand-badge-outline-primary">Outline</span>

<!-- Notification Dot -->
<button class="antsand-btn antsand-btn-primary" style="position: relative;">
    Notifications
    <span class="antsand-badge antsand-badge-dot antsand-badge-danger antsand-badge-notification"></span>
</button>
```

---

### Breadcrumb

Navigation breadcrumb trail.

```html
<nav class="antsand-breadcrumb">
    <div class="antsand-breadcrumb-item">
        <a href="#">Home</a>
    </div>
    <div class="antsand-breadcrumb-item">
        <a href="#">Library</a>
    </div>
    <div class="antsand-breadcrumb-item active">
        Data
    </div>
</nav>

<!-- Custom Separators -->
<nav class="antsand-breadcrumb antsand-breadcrumb-separator-arrow">
    <!-- uses › separator -->
</nav>

<nav class="antsand-breadcrumb antsand-breadcrumb-separator-chevron">
    <!-- uses » separator -->
</nav>
```

---

## Layout

### Grid System

Modern CSS Grid (no float!).

```html
<!-- Fixed Columns -->
<div class="antsand-grid antsand-grid-3 antsand-gap-3">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
</div>

<!-- Auto-Responsive (no media queries!) -->
<div class="antsand-grid antsand-grid-auto antsand-gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
</div>

<!-- Flexbox -->
<div class="antsand-flex antsand-flex-between">
    <div>Left</div>
    <div>Right</div>
</div>

<div class="antsand-flex antsand-flex-center">
    <div>Centered</div>
</div>
```

#### Grid Classes

- `.antsand-grid` - Base grid
- `.antsand-grid-[1-6]` - Fixed columns (1-6)
- `.antsand-grid-auto` - Auto-responsive
- `.antsand-gap-[1-5]` - Gap sizes
- `.antsand-flex` - Flexbox
- `.antsand-flex-between` / `.antsand-flex-center` / `.antsand-flex-start` / `.antsand-flex-end` - Flex alignment
- `.antsand-flex-col` - Flex column
- `.antsand-flex-gap-[1-4]` - Flex gap

---

### Container

Responsive containers.

```html
<!-- Responsive Container -->
<div class="antsand-container">
    Content with max-width breakpoints
</div>

<!-- Fluid Container -->
<div class="antsand-container-fluid">
    Full-width content with padding
</div>
```

---

### Sections

Vertical spacing wrappers.

```html
<!-- Standard Section -->
<section class="antsand-section">
    <div class="antsand-container">
        Content
    </div>
</section>

<!-- Size Variants -->
<section class="antsand-section-sm">Small padding</section>
<section class="antsand-section-lg">Large padding</section>

<!-- Background Variants -->
<section class="antsand-section antsand-section-light">Light background</section>
<section class="antsand-section antsand-section-dark">Dark background</section>
<section class="antsand-section antsand-section-primary">Primary color</section>
```

---

## Patterns

### Hero

Hero section layouts.

```html
<!-- Centered Hero -->
<section class="antsand-hero">
    <div class="antsand-container">
        <h1 class="antsand-hero-title">Welcome to Our Service</h1>
        <p class="antsand-hero-subtitle">Build amazing websites with modern tools</p>
        <div class="antsand-hero-cta">
            <button class="antsand-btn antsand-btn-primary antsand-btn-lg">Get Started</button>
            <button class="antsand-btn antsand-btn-outline-primary antsand-btn-lg">Learn More</button>
        </div>
    </div>
</section>

<!-- Hero with Background Image -->
<section class="antsand-hero antsand-hero-bg" style="background-image: url('hero.jpg')">
    <!-- content -->
</section>

<!-- Hero with Gradient -->
<section class="antsand-hero antsand-hero-gradient">
    <!-- content -->
</section>

<!-- Split Hero (Image + Text) -->
<section class="antsand-hero-split">
    <div class="antsand-container">
        <div class="antsand-hero-content">
            <h1 class="antsand-hero-title">Title</h1>
            <p class="antsand-hero-subtitle">Subtitle</p>
            <div class="antsand-hero-cta">
                <!-- buttons -->
            </div>
        </div>
        <div class="antsand-hero-image">
            <img src="hero.png" alt="Hero">
        </div>
    </div>
</section>
```

---

### Features

Feature grid layouts.

```html
<!-- Feature Grid -->
<section class="antsand-features">
    <div class="antsand-feature-item">
        <div class="antsand-feature-icon">🚀</div>
        <h3 class="antsand-feature-title">Fast Performance</h3>
        <p class="antsand-feature-desc">Lightning-fast load times.</p>
    </div>

    <div class="antsand-feature-item">
        <div class="antsand-feature-icon antsand-feature-icon-circle antsand-feature-icon-primary">
            🔒
        </div>
        <h3 class="antsand-feature-title">Secure</h3>
        <p class="antsand-feature-desc">Enterprise-grade security.</p>
    </div>
</section>

<!-- Left-Aligned Features -->
<section class="antsand-features antsand-features-left">
    <!-- features -->
</section>

<!-- Features with Cards -->
<section class="antsand-features antsand-features-cards">
    <!-- features -->
</section>

<!-- Large Feature with Image -->
<div class="antsand-feature-large">
    <div class="antsand-feature-large-image">
        <img src="feature.jpg" alt="Feature">
    </div>
    <div class="antsand-feature-large-content">
        <h3>Amazing Feature</h3>
        <p>Description of the feature.</p>
        <ul>
            <li>Benefit 1</li>
            <li>Benefit 2</li>
        </ul>
        <button class="antsand-btn antsand-btn-primary">Learn More</button>
    </div>
</div>
```

---

### Pricing

Pricing table layouts.

```html
<section class="antsand-pricing">
    <div class="antsand-pricing-card">
        <div class="antsand-pricing-header">
            <h3>Basic</h3>
            <p>For individuals</p>
        </div>
        <div class="antsand-pricing-price">
            <div class="price">
                <span class="currency">$</span>9<span class="period">/mo</span>
            </div>
        </div>
        <ul class="antsand-pricing-features">
            <li>5 Projects</li>
            <li>10GB Storage</li>
            <li class="disabled">Priority Support</li>
        </ul>
        <button class="antsand-btn antsand-btn-primary antsand-pricing-cta">Choose Plan</button>
    </div>

    <!-- Highlighted Plan -->
    <div class="antsand-pricing-card antsand-pricing-highlight">
        <span class="antsand-pricing-badge">Popular</span>
        <!-- content -->
    </div>
</section>

<!-- Dark Pricing -->
<section class="antsand-pricing antsand-pricing-dark">
    <!-- cards -->
</section>
```

---

### Footer

Footer layouts.

```html
<footer class="antsand-footer">
    <div class="antsand-container">
        <div class="antsand-footer-grid">
            <div class="antsand-footer-column">
                <h4>Company</h4>
                <p>Building amazing products since 2024.</p>
                <div class="antsand-footer-social">
                    <a href="#">FB</a>
                    <a href="#">TW</a>
                    <a href="#">IG</a>
                </div>
            </div>

            <div class="antsand-footer-column">
                <h4>Quick Links</h4>
                <ul class="antsand-footer-links">
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>

        <div class="antsand-footer-bottom">
            <p class="antsand-footer-copyright">© 2024 Company. All rights reserved.</p>
            <ul class="antsand-footer-bottom-links">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
            </ul>
        </div>
    </div>
</footer>

<!-- Light Footer -->
<footer class="antsand-footer antsand-footer-light">
    <!-- content -->
</footer>
```

---

## Utilities

Bootstrap-style utility classes for quick styling.

### Text

```html
<!-- Alignment -->
<p class="antsand-text-left">Left</p>
<p class="antsand-text-center">Center</p>
<p class="antsand-text-right">Right</p>

<!-- Colors -->
<p class="antsand-text-primary">Primary</p>
<p class="antsand-text-success">Success</p>
<p class="antsand-text-muted">Muted</p>

<!-- Sizes -->
<p class="antsand-text-sm">Small</p>
<p class="antsand-text-lg">Large</p>
<p class="antsand-text-3xl">3XL</p>

<!-- Weight -->
<p class="antsand-text-bold">Bold</p>
<p class="antsand-text-semibold">Semibold</p>

<!-- Transform -->
<p class="antsand-text-uppercase">Uppercase</p>
```

### Spacing

```html
<!-- Margin -->
<div class="antsand-m-3">Margin all sides</div>
<div class="antsand-mt-4">Margin top</div>
<div class="antsand-mb-2">Margin bottom</div>
<div class="antsand-mx-auto">Margin auto horizontal</div>

<!-- Padding -->
<div class="antsand-p-4">Padding all sides</div>
<div class="antsand-pt-3">Padding top</div>
<div class="antsand-pb-5">Padding bottom</div>
```

**Spacing scale**: 0-8 (0, 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem)

### Display

```html
<div class="antsand-d-none">Hidden</div>
<div class="antsand-d-block">Block</div>
<div class="antsand-d-flex">Flex</div>
<div class="antsand-d-grid">Grid</div>
```

### Width & Height

```html
<div class="antsand-w-25">25% width</div>
<div class="antsand-w-50">50% width</div>
<div class="antsand-w-100">100% width</div>

<div class="antsand-h-100">100% height</div>
```

### Background & Borders

```html
<div class="antsand-bg-primary">Primary background</div>
<div class="antsand-border">Border</div>
<div class="antsand-rounded">Rounded corners</div>
<div class="antsand-shadow-lg">Large shadow</div>
```

---

## JavaScript

### Auto-Initialization

All interactive components are automatically initialized on page load:

```html
<script src="/path/to/antsand.js"></script>
<!-- Components work automatically! -->
```

### Manual Initialization

```javascript
// Initialize specific components
Antsand.accordion.init();
Antsand.tabs.init();
Antsand.modal.init();
Antsand.navbar.init();
Antsand.dropdown.init();
Antsand.alert.init();

// Or initialize all
Antsand.init();
```

### Custom Selectors

```javascript
// Initialize with custom selector
Antsand.accordion.init('.my-custom-accordion');
Antsand.tabs.init('.my-custom-tabs');
```

---

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

---

## License

MIT - Use anywhere, modify freely

---

Built with ❤️ for ANTSAND projects
*"Semantic classes + utility helpers = Consistent, lightweight styling"*
