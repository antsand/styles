# ANTSAND v2 - Databoard Integration Guide

## 🎯 Quick Start

The ANTSAND v2 library is now fully integrated with the databoard template system. This guide shows how to use SVG templates with ANTSAND v2 CSS classes.

---

## 📐 The Core Philosophy

**Every ANTSAND section = Header + Body + Footer**

Same Volt structure + Different CSS = Different designs

```volt
<!-- All templates use this structure -->
<section>
    {% if about_section['header'] is defined %}
        {% include 'layouts/common_section_header_modern.volt' %}
    {% endif %}

    {% if about_section['body'] is defined %}
        {% include 'layouts/common_section_body_modern.volt' %}
    {% endif %}

    {% if about_section['footer'] is defined %}
        {% include 'layouts/common_section_footer_modern.volt' %}
    {% endif %}
</section>
```

---

## 🎨 How It Works in Databoard

### 1. User Selects SVG Template
User clicks a template from the databoard library (e.g., "Intro 3" - Hero Split)

### 2. System Loads Configuration
```javascript
// From outline2design.json
{
  "name": "Intro 3",
  "src": "/builds/production/images/concept2design/intro-3.svg",
  "phalcon_template": "/antsand_bootstrap/project/common_views/intro_banner/intro-9.volt",
  "parameters_file": "service-3-data-css",
  "css": {
    "header": {
      "column_count": { "count": 2, "flip": false },
      "section": {
        "css_class": "antsand-hero antsand-hero-split antsand-section"
      },
      "container": {
        "css_class": "antsand-grid antsand-grid-2 antsand-flex-align-center"
      }
    }
  }
}
```

### 3. ANTSAND Renders with CSS Classes
The `common_init_modern.volt` processes the CSS config and applies classes to the Volt template.

### 4. Result
Same Volt template → Different CSS → Hero Split layout!

---

## 🔧 Available ANTSAND v2 Classes for Databoard

### Layout Classes

#### Grid Systems
```css
/* Column grids */
.antsand-grid.antsand-grid-1    /* 1 column (full width) */
.antsand-grid.antsand-grid-2    /* 2 columns (50/50) */
.antsand-grid.antsand-grid-3    /* 3 columns */
.antsand-grid.antsand-grid-4    /* 4 columns */
.antsand-grid.antsand-grid-auto /* Auto-fit columns */

/* Flexbox */
.antsand-d-flex                 /* Display flex */
.antsand-flex-center            /* Center everything */
.antsand-flex-between           /* Space between */
.antsand-flex-align-center      /* Vertical center */
```

#### Containers
```css
.antsand-container              /* Max-width container (1200px) */
.antsand-container-fluid        /* Full-width container */
.antsand-section                /* Section padding (4rem top/bottom) */
.antsand-section-sm             /* Small section (2rem) */
.antsand-section-lg             /* Large section (6rem) */
```

### Component Classes

#### Hero Sections
```css
.antsand-hero                   /* Base hero */
.antsand-hero-centered          /* Centered hero */
.antsand-hero-split             /* Split layout hero */
.antsand-hero-gradient          /* Gradient background */
```

#### Cards
```css
.antsand-card                   /* Base card */
.antsand-card-hover             /* Hover effect */
.antsand-overflow-hidden        /* Hide overflow */
```

#### Pricing
```css
.antsand-pricing-container      /* Pricing wrapper */
.antsand-pricing-card           /* Individual plan */
.antsand-pricing-card-highlighted /* Featured plan */
.antsand-pricing-title          /* Plan name */
.antsand-pricing-price          /* Price display */
.antsand-pricing-features       /* Feature list */
```

#### Footer
```css
.antsand-footer                 /* Base footer */
.antsand-footer-dark            /* Dark variant */
.antsand-footer-light           /* Light variant */
.antsand-footer-columns         /* Column layout */
.antsand-footer-social          /* Social links */
```

### Typography Classes

```css
/* Headings */
.antsand-text-xs                /* 0.75rem */
.antsand-text-sm                /* 0.875rem */
.antsand-text-base              /* 1rem */
.antsand-text-lg                /* 1.125rem */
.antsand-text-xl                /* 1.25rem */
.antsand-text-2xl               /* 1.5rem */
.antsand-text-3xl               /* 1.875rem */
.antsand-text-4xl               /* 2.25rem */

/* Alignment */
.antsand-text-left
.antsand-text-center
.antsand-text-right

/* Colors */
.antsand-text-primary
.antsand-text-secondary
.antsand-text-muted
.antsand-text-white
```

### Spacing Utilities

```css
/* Margin */
.antsand-m-{0-8}                /* All sides */
.antsand-mt-{0-8}               /* Top */
.antsand-mb-{0-8}               /* Bottom */
.antsand-ml-{0-8}               /* Left */
.antsand-mr-{0-8}               /* Right */

/* Padding */
.antsand-p-{0-8}                /* All sides */
.antsand-pt-{0-8}               /* Top */
.antsand-pb-{0-8}               /* Bottom */
.antsand-pl-{0-8}               /* Left */
.antsand-pr-{0-8}               /* Right */

/* Scale: 0=0, 1=0.5rem, 2=1rem, 3=1.5rem, 4=2rem, etc. */
```

### Background & Border

```css
/* Backgrounds */
.antsand-bg-primary
.antsand-bg-secondary
.antsand-bg-success
.antsand-bg-danger
.antsand-bg-light
.antsand-bg-dark

/* Borders */
.antsand-border
.antsand-rounded                /* Border radius */
.antsand-rounded-lg             /* Large radius */
.antsand-rounded-circle         /* Circular */

/* Shadows */
.antsand-shadow-sm
.antsand-shadow-md
.antsand-shadow-lg
.antsand-shadow-xl
```

### Sizing

```css
/* Width */
.antsand-w-25                   /* 25% */
.antsand-w-50                   /* 50% */
.antsand-w-75                   /* 75% */
.antsand-w-100                  /* 100% */
.antsand-w-auto                 /* Auto */

/* Height */
.antsand-h-25
.antsand-h-50
.antsand-h-75
.antsand-h-100
.antsand-h-auto
```

### Interactive Components

```css
/* Buttons */
.antsand-btn                    /* Base button */
.antsand-btn-primary
.antsand-btn-secondary
.antsand-btn-success
.antsand-btn-outline-primary    /* Outline variants */
.antsand-btn-sm                 /* Small */
.antsand-btn-lg                 /* Large */
.antsand-btn-block              /* Full width */

/* Badges */
.antsand-badge
.antsand-badge-primary
.antsand-badge-pill
.antsand-badge-dot

/* Alerts */
.antsand-alert
.antsand-alert-success
.antsand-alert-danger
.antsand-alert-dismissible

/* Accordion */
.antsand-accordion
.antsand-accordion-header
.antsand-accordion-body

/* Tabs */
.antsand-tabs
.antsand-tabs-pills
.antsand-tabs-vertical

/* Modal */
.antsand-modal
.antsand-modal-sm
.antsand-modal-lg
.antsand-modal-xl
```

---

## 📋 Common CSS Configurations for Databoard

### Pattern 1: Hero Centered
```json
{
  "header": {
    "section": {
      "css_class": "antsand-hero antsand-hero-centered antsand-bg-primary antsand-text-white"
    },
    "container": {
      "css_class": "antsand-container antsand-text-center"
    },
    "h1": {
      "css_class": "antsand-text-4xl antsand-mb-4"
    },
    "cta": {
      "css_class": "antsand-btn antsand-btn-light antsand-btn-lg"
    }
  }
}
```

### Pattern 2: Feature Grid (3 Columns)
```json
{
  "header": {
    "section": {
      "css_class": "antsand-text-center antsand-mb-8"
    },
    "h1": {
      "css_class": "antsand-text-3xl"
    }
  },
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-3 antsand-section"
    },
    "sub_container": {
      "css_class": "antsand-card antsand-text-center antsand-p-5"
    }
  }
}
```

### Pattern 3: Split Layout (Image + Text)
```json
{
  "header": {
    "column_count": {
      "count": 2,
      "flip": false
    },
    "section": {
      "css_class": "antsand-section"
    },
    "container": {
      "css_class": "antsand-grid antsand-grid-2 antsand-flex-align-center"
    },
    "media": {
      "css_class": "antsand-w-100 antsand-rounded-lg antsand-shadow-lg"
    }
  }
}
```

### Pattern 4: Pricing Cards
```json
{
  "data": {
    "container": {
      "css_class": "antsand-pricing-container antsand-grid antsand-grid-3"
    },
    "sub_container": {
      "css_class": "antsand-pricing-card"
    },
    "title": {
      "css_class": "antsand-pricing-title"
    },
    "cta": {
      "css_class": "antsand-btn antsand-btn-primary antsand-btn-block"
    }
  }
}
```

### Pattern 5: Blog Grid
```json
{
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-3 antsand-section"
    },
    "sub_container": {
      "css_class": "antsand-card antsand-overflow-hidden"
    },
    "img_src": {
      "css_class": "antsand-w-100"
    },
    "content_wrapper": {
      "css_class": "antsand-p-5"
    },
    "span": {
      "css_class": "antsand-badge antsand-badge-primary"
    }
  }
}
```

---

## 🚀 Adding New Patterns to Databoard

### Step 1: Create SVG Template
Design your layout in Figma/Illustrator, export as SVG
Place in: `/public/builds/production/images/concept2design/`

### Step 2: Add to outline2design.json
```json
{
  "name": "My Custom Layout",
  "src": "/builds/production/images/concept2design/custom-1.svg",
  "phalcon_template": "/antsand_bootstrap/project/common_views/services_products/service_3_modern.volt",
  "parameters_file": "service-3-data-css",
  "css": {
    "header": {
      "section": {
        "css_class": "antsand-YOUR-CLASSES-HERE"
      }
    }
  }
}
```

### Step 3: Use ANTSAND v2 Classes
Choose from the available classes above, or create custom ones in your SASS.

### Step 4: Test in Databoard
- Select the template from the library
- Verify the layout renders correctly
- Adjust CSS classes as needed

---

## 📚 Key Files Reference

### Volt Templates
- **Base Structure**: `/app/antsand_bootstrap/project/common_views/services_products/service_3_modern.volt`
- **Header Include**: `/app/antsand_bootstrap/project/common_views/common/common_section_header_modern.volt`
- **Body Include**: `/app/antsand_bootstrap/project/common_views/common/common_section_body_modern.volt`
- **CSS Init**: `/app/antsand_bootstrap/project/common_views/common/common_init_modern.volt`

### Configuration
- **Template Library**: `/app/antsand_bootstrap/project/common_views/outline2design.json`
- **Parameter Files**: `/app/antsand_bootstrap/project/common_views/parameter_files.json`

### ANTSAND v2 Styles
- **Main SCSS**: `/styles_antsand/antsand.scss`
- **Components**: `/styles_antsand/components/`
- **Patterns**: `/styles_antsand/patterns/`
- **Utilities**: `/styles_antsand/foundation/_utilities.scss`

### Databoard JavaScript
- **Canvas Module**: `/app/backend/databoard/js/canvas.module.js`
- **Template Module**: `/app/backend/databoard/js/templates.module.js`

---

## 🎯 Pro Tips for Databoard Integration

1. **Start with Base Patterns**: Use existing patterns (hero, grid, split) as starting points
2. **Combine Classes**: Stack utilities for complex layouts: `antsand-grid antsand-grid-3 antsand-flex-align-center`
3. **Use Section Padding**: Add `antsand-section` for consistent vertical spacing
4. **Leverage column_count**: Set `flip: true` for alternating image/text layouts
5. **Card-Based Designs**: Use `antsand-card` for consistent elevation and spacing
6. **Responsive by Default**: All ANTSAND v2 classes are mobile-responsive

---

## 🔄 Workflow Example

### User Story: "I want a 3-column feature grid with icons"

1. **User selects** "Feature 1" template in databoard
2. **System loads** `features-1.svg` configuration
3. **CSS applies** `antsand-grid antsand-grid-3` to data container
4. **Each item gets** `antsand-card antsand-text-center antsand-p-5`
5. **Result**: 3-column responsive grid with centered content

### Behind the Scenes:
```javascript
// canvas.module.js recognizes the template
const template = websiteData.landing.find(t => t.name === "Features / Benefits");

// Loads CSS configuration
const css = template['layout type'][0].css;

// Applies to Volt template
about_section['data']['container']['css_class'] = "antsand-grid antsand-grid-3";
```

---

## 📊 Quick Reference Table

| Layout Type | SVG Template | Key ANTSAND Classes |
|-------------|--------------|---------------------|
| Hero Centered | intro-1.svg | `antsand-hero-centered`, `antsand-text-center` |
| Hero Split | intro-3.svg | `antsand-hero-split`, `antsand-grid-2` |
| Feature Grid | features-1.svg | `antsand-grid-3`, `antsand-card` |
| About/Content | about-2.svg | `antsand-grid-2`, `flip: true` |
| Pricing | pricing-1.svg | `antsand-pricing-card`, `antsand-grid-3` |
| Blog Grid | blog-1.svg | `antsand-card`, `antsand-grid-3` |
| Team | team-1.svg | `antsand-grid-4`, `antsand-rounded-circle` |
| Contact | contact-1.svg | `antsand-grid-2`, form + map split |
| FAQ | faq-1.svg | `antsand-accordion` |
| Footer | footer-1.svg | `antsand-footer-dark`, `antsand-grid-4` |

---

## 📖 Additional Resources

- **Complete Component Docs**: `/builds/production/css/antsand-v2/README_COMPLETE.md`
- **Template Mapping Guide**: `/builds/production/css/antsand-v2/TEMPLATE_GUIDE.md`
- **What's New**: `/builds/production/css/antsand-v2/WHATS_NEW.md`
- **Interactive Demo**: `/builds/production/css/antsand-v2/demo_layouts.html`

---

## 🎉 Summary

ANTSAND v2 is designed to work seamlessly with the databoard:

1. **Same Structure** = Header + Body + Footer (always)
2. **Different CSS** = Different designs
3. **200+ Utility Classes** = Infinite combinations
4. **SVG Templates** = Visual guide for users
5. **Property-Driven** = Right tool for the job

**The Philosophy**: *"One structure, infinite designs"*

Built with ❤️ for ANTSAND Databoard
