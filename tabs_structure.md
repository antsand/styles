# ANTSAND v2 Tabs Component - HTML Structure Guide

## Key Principle: Same HTML, Different Parent Class

The ANTSAND tabs component uses **identical HTML structure** for all variants. Only the parent container class changes to achieve different layouts.

## Core HTML Structure

```html
<!-- Tab Navigation Container -->
<div class="tabs-container-[VARIANT]">
    <div class="tab-[VARIANT] active" data-tab="tab-0" onclick="switchTab('tab-group', 0)">
        Tab 1
    </div>
    <div class="tab-[VARIANT]" data-tab="tab-1" onclick="switchTab('tab-group', 1)">
        Tab 2
    </div>
    <div class="tab-[VARIANT]" data-tab="tab-2" onclick="switchTab('tab-group', 2)">
        Tab 3
    </div>
</div>

<!-- Tab Content Panels -->
<div class="tab-content-wrapper">
    <div class="tab-content active" id="tab-0">
        <h3>Content Title 1</h3>
        <p>Content for tab 1</p>
    </div>
    <div class="tab-content" id="tab-1">
        <h3>Content Title 2</h3>
        <p>Content for tab 2</p>
    </div>
    <div class="tab-content" id="tab-2">
        <h3>Content Title 3</h3>
        <p>Content for tab 3</p>
    </div>
</div>
```

## Three Variants

### 1. Pills Tabs (Horizontal - Rounded)

**Parent Class:** `tabs-container-h-pills`
**Tab Class:** `tab-h-pills`

```html
<div class="tabs-container-h-pills">
    <div class="tab-h-pills active" data-tab="tab-0">Features</div>
    <div class="tab-h-pills" data-tab="tab-1">Pricing</div>
    <div class="tab-h-pills" data-tab="tab-2">Support</div>
</div>

<div class="tab-content-wrapper">
    <div class="tab-content active" id="tab-0">Features content...</div>
    <div class="tab-content" id="tab-1">Pricing content...</div>
    <div class="tab-content" id="tab-2">Support content...</div>
</div>
```

**Visual Style:**
- Rounded pill-shaped buttons
- Contained in a rounded background
- Gradient on active state
- Centered horizontally

---

### 2. Steps Tabs (Horizontal - Sequential)

**Parent Class:** `tabs-container-h-steps`
**Tab Class:** `tab-h-steps`

```html
<div class="tabs-container-h-steps">
    <div class="tab-h-steps active" data-tab="tab-0">01 Setup</div>
    <div class="tab-h-steps" data-tab="tab-1">02 Configure</div>
    <div class="tab-h-steps" data-tab="tab-2">03 Launch</div>
</div>

<div class="tab-content-wrapper">
    <div class="tab-content active" id="tab-0">Setup content...</div>
    <div class="tab-content" id="tab-1">Configure content...</div>
    <div class="tab-content" id="tab-2">Launch content...</div>
</div>
```

**Visual Style:**
- Box-shaped buttons
- Connected horizontally
- Bottom border on active state
- Equal width distribution
- Step numbers shown

---

### 3. Vertical Tabs (Sidebar Navigation)

**Parent Class:** `tabs-container-vertical`
**Tab Class:** `tab-vertical`
**Layout Wrapper:** `vertical-tabs-layout`

```html
<div class="vertical-tabs-layout">
    <div class="tabs-container-vertical">
        <div class="tab-vertical active" data-tab="tab-0">Overview</div>
        <div class="tab-vertical" data-tab="tab-1">Features</div>
        <div class="tab-vertical" data-tab="tab-2">Details</div>
    </div>

    <div class="tab-content-wrapper">
        <div class="tab-content active" id="tab-0">Overview content...</div>
        <div class="tab-content" id="tab-1">Features content...</div>
        <div class="tab-content" id="tab-2">Details content...</div>
    </div>
</div>
```

**Visual Style:**
- Vertical stack of tabs
- Side-by-side layout (tabs | content)
- Rounded tabs
- Border separator between tabs and content

---

## Required Elements

### 1. Navigation Container

```html
<div class="tabs-container-[VARIANT]" id="[unique-id]-nav">
```

- **Class:** Must have `tabs-container-` prefix + variant name
- **ID:** Optional but recommended for JavaScript targeting

### 2. Individual Tabs

```html
<div class="tab-[VARIANT] [active?]"
     data-tab="[unique-id]-[index]"
     onclick="switchTab('[group-id]', [index])">
    Tab Label
</div>
```

- **Class:** `tab-` prefix + variant name + `active` on first tab
- **data-tab:** Unique identifier matching content panel ID
- **onclick:** JavaScript function to switch tabs

### 3. Content Wrapper

```html
<div class="tab-content-wrapper">
```

- **Optional but recommended** for consistent spacing

### 4. Content Panels

```html
<div class="tab-content [active?]" id="[unique-id]-[index]">
    <!-- Content here -->
</div>
```

- **Class:** Always `tab-content` + `active` on first panel
- **ID:** Must match the `data-tab` attribute on corresponding tab
- **First tab:** Must have `active` class to be visible on load

---

## CSS Requirements

The component relies on these base CSS rules (included in antsand-v2-tabs.css):

```css
/* Hide all tab content by default */
.tab-content {
    display: none;
}

/* Show active tab content */
.tab-content.active {
    display: block;
}
```

**Variant-specific styles** are defined for each parent class:
- `.tabs-container-h-pills` / `.tab-h-pills` - Pills styling
- `.tabs-container-h-steps` / `.tab-h-steps` - Steps styling
- `.tabs-container-vertical` / `.tab-vertical` - Vertical styling

---

## JavaScript

Simple tab switching function (inline or external):

```javascript
function switchTab(tabGroupId, tabIndex) {
    const navContainer = document.getElementById(tabGroupId + '-nav');
    const tabs = navContainer.querySelectorAll('[data-tab]');
    const contentPanes = Array.from(
        document.querySelectorAll('[id^="' + tabGroupId + '-"]')
    ).filter(el => el.classList.contains('tab-content'));

    // Deactivate all
    tabs.forEach(tab => tab.classList.remove('active'));
    contentPanes.forEach(pane => pane.classList.remove('active'));

    // Activate selected
    tabs[tabIndex].classList.add('active');
    contentPanes[tabIndex].classList.add('active');
}
```

---

## Quick Reference: Class Mapping

| Variant | Container Class | Tab Class | Layout Wrapper |
|---------|----------------|-----------|----------------|
| Pills | `tabs-container-h-pills` | `tab-h-pills` | None |
| Steps | `tabs-container-h-steps` | `tab-h-steps` | None |
| Vertical | `tabs-container-vertical` | `tab-vertical` | `vertical-tabs-layout` |

**Content class is ALWAYS:** `tab-content`

---

## Usage in Parameter Files

```json
{
  "name": "Service with Tabs",
  "phalcon_template": "/databoard/views/layouts/tabs_renderer.volt",
  "styles": ["antsand-v2-fonts", "antsand-v2-tabs"],
  "parameters_file": "service_tabs_pills",
  "css": {
    "tab_variant": "pills"
  },
  "data": [
    {
      "tab_title": "Features",
      "title": "Amazing Features",
      "description": "Our product includes..."
    },
    {
      "tab_title": "Pricing",
      "title": "Simple Pricing",
      "description": "Choose your plan..."
    }
  ]
}
```

Change `"tab_variant"` to `"pills"`, `"steps"`, or `"vertical"` to switch layouts using the same HTML structure!
