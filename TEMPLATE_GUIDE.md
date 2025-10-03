# ANTSAND v2 Template-to-CSS Mapping Guide

## 🎯 The ANTSAND Philosophy

**Every section is just: Header + Body + Footer**

By changing CSS classes, you can transform the same HTML structure into any design pattern.

```html
<section>
    <div class="header">...</div>
    <div class="body">...</div>
    <div class="footer">...</div>
</section>
```

---

## 📐 Core Volt Structure

```volt
<!-- service_3_modern.volt -->
{% if data %}
    {% include 'layouts/common_init_modern.volt' %}

    <section id="{{ section_id }}"
             class="{{ section_class }}"
             style="{{ section_style }}">

        <!-- HEADER -->
        {% if about_section['header'] is defined %}
            {% include 'layouts/common_section_header_modern.volt' %}
        {% endif %}

        <!-- BODY/DATA -->
        {% if about_section['body'] is defined %}
            {% include 'layouts/common_section_body_modern.volt' %}
        {% endif %}

        <!-- FOOTER -->
        {% if about_section['footer'] is defined %}
            {% include 'layouts/common_section_footer_modern.volt' %}
        {% endif %}
    </section>
{% endif %}
```

---

## 🎨 Layout Pattern Examples

### Pattern 1: Hero Centered (Intro-1)
**SVG**: `/builds/production/images/concept2design/intro-1.svg`

**CSS Configuration**:
```json
{
  "header": {
    "section": {
      "css_class": "antsand-hero antsand-hero-centered antsand-section antsand-bg-primary"
    },
    "container": {
      "css_class": "antsand-container antsand-text-center"
    },
    "h1": {
      "css_class": "antsand-text-4xl antsand-text-white antsand-mb-4"
    },
    "h2": {
      "css_class": "antsand-text-xl antsand-text-white antsand-mb-6"
    },
    "cta_container": {
      "css_class": "antsand-d-flex antsand-flex-center antsand-mt-6"
    },
    "cta": {
      "css_class": "antsand-btn antsand-btn-light antsand-btn-lg"
    }
  }
}
```

**Result**: Full-width hero with centered text, primary background, white text, large CTA button

---

### Pattern 2: Split Hero with Image (Intro-3)
**SVG**: `/builds/production/images/concept2design/intro-3.svg`

**CSS Configuration**:
```json
{
  "section": {
    "container": {
      "css_class": "antsand-container"
    }
  },
  "header": {
    "column_count": {
      "count": 2,
      "flip": false
    },
    "section": {
      "css_class": "antsand-hero antsand-hero-split antsand-section"
    },
    "container": {
      "css_class": "antsand-grid antsand-grid-2 antsand-flex-align-center"
    },
    "h1": {
      "css_class": "antsand-text-3xl antsand-mb-4"
    },
    "p": {
      "css_class": "antsand-text-lg antsand-mb-6"
    },
    "media": {
      "css_class": "antsand-w-100 antsand-rounded-lg antsand-shadow-lg"
    }
  }
}
```

**Result**: 50/50 split layout - text left, image right, vertically centered

---

### Pattern 3: Feature Grid (Features-1)
**SVG**: `/builds/production/images/concept2design/features-1.svg`

**CSS Configuration**:
```json
{
  "header": {
    "section": {
      "css_class": "antsand-text-center antsand-mb-8"
    },
    "h1": {
      "css_class": "antsand-text-3xl antsand-mb-3"
    },
    "p": {
      "css_class": "antsand-text-lg antsand-text-muted"
    }
  },
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-3 antsand-section"
    },
    "sub_container": {
      "css_class": "antsand-card antsand-text-center antsand-p-5"
    },
    "img_container": {
      "css_class": "antsand-mb-4"
    },
    "img_src": {
      "css_class": "antsand-w-25"
    },
    "h3": {
      "css_class": "antsand-text-xl antsand-mb-3"
    },
    "p": {
      "css_class": "antsand-text-base"
    }
  }
}
```

**Result**: 3-column grid, centered text, icon at top, card-based layout

---

### Pattern 4: Alternating Sections (About-2)
**SVG**: `/builds/production/images/concept2design/about-2.svg`

**CSS Configuration**:
```json
{
  "section": {
    "container": {
      "css_class": "antsand-container antsand-section"
    }
  },
  "data": {
    "column_count": {
      "count": 2,
      "flip": true
    },
    "container": {
      "css_class": "antsand-grid antsand-grid-2 antsand-flex-align-center antsand-mb-8"
    },
    "img_container": {
      "css_class": "antsand-w-100"
    },
    "img_src": {
      "css_class": "antsand-rounded-lg antsand-shadow-md"
    },
    "content_wrapper": {
      "css_class": "antsand-p-5"
    },
    "h2": {
      "css_class": "antsand-text-2xl antsand-mb-4"
    },
    "p": {
      "css_class": "antsand-text-base antsand-mb-4"
    }
  }
}
```

**Result**: Image left, text right (flip: true alternates each item)

---

### Pattern 5: Pricing Table (Pricing-1)
**SVG**: `/builds/production/images/concept2design/pricing-1.svg`

**CSS Configuration**:
```json
{
  "header": {
    "section": {
      "css_class": "antsand-text-center antsand-mb-8"
    },
    "h1": {
      "css_class": "antsand-text-3xl antsand-mb-3"
    },
    "p": {
      "css_class": "antsand-text-lg antsand-text-muted"
    }
  },
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
    "sub_heading": {
      "css_class": "antsand-pricing-price"
    },
    "p": {
      "css_class": "antsand-pricing-features"
    },
    "cta_container": {
      "css_class": "antsand-text-center antsand-mt-auto"
    },
    "cta": {
      "css_class": "antsand-btn antsand-btn-primary antsand-btn-block"
    }
  }
}
```

**Result**: 3-column pricing cards with features list and CTA button

---

### Pattern 6: Blog Grid (Blog-1)
**SVG**: `/builds/production/images/concept2design/blog-1.svg`

**CSS Configuration**:
```json
{
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-3 antsand-section"
    },
    "sub_container": {
      "css_class": "antsand-card antsand-overflow-hidden"
    },
    "img_container": {
      "css_class": "antsand-w-100"
    },
    "img_src": {
      "css_class": "antsand-w-100 antsand-h-auto"
    },
    "content_wrapper": {
      "css_class": "antsand-p-5"
    },
    "h3": {
      "css_class": "antsand-text-xl antsand-mb-3"
    },
    "p": {
      "css_class": "antsand-text-base antsand-mb-4"
    },
    "span": {
      "css_class": "antsand-badge antsand-badge-primary antsand-mb-3"
    },
    "cta": {
      "css_class": "antsand-btn antsand-btn-outline-primary"
    }
  }
}
```

**Result**: 3-column blog grid with image, category badge, title, excerpt, and read more link

---

### Pattern 7: Contact Form (Contact-1)
**SVG**: `/builds/production/images/concept2design/contact-1.svg`

**CSS Configuration**:
```json
{
  "section": {
    "container": {
      "css_class": "antsand-container antsand-section"
    }
  },
  "header": {
    "column_count": {
      "count": 2
    },
    "section": {
      "css_class": "antsand-text-center antsand-mb-8"
    },
    "h1": {
      "css_class": "antsand-text-3xl antsand-mb-4"
    }
  },
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-2"
    },
    "form_container": {
      "css_class": "antsand-card antsand-p-6"
    },
    "img_container": {
      "css_class": "antsand-w-100 antsand-d-flex antsand-flex-center"
    }
  }
}
```

**Result**: Split layout - contact form left, map/image right

---

### Pattern 8: Team Grid (Team-1)
**SVG**: `/builds/production/images/concept2design/team-1.svg`

**CSS Configuration**:
```json
{
  "data": {
    "container": {
      "css_class": "antsand-grid antsand-grid-4 antsand-section"
    },
    "sub_container": {
      "css_class": "antsand-text-center"
    },
    "img_container": {
      "css_class": "antsand-mb-4"
    },
    "img_src": {
      "css_class": "antsand-rounded-circle antsand-w-75"
    },
    "h3": {
      "css_class": "antsand-text-lg antsand-mb-2"
    },
    "p": {
      "css_class": "antsand-text-sm antsand-text-muted"
    }
  }
}
```

**Result**: 4-column grid with circular avatars, name, and role

---

### Pattern 9: FAQ Accordion (FAQ-1)
**SVG**: `/builds/production/images/concept2design/faq-1.svg`

**CSS Configuration**:
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
    "accordian_container": {
      "css_class": "antsand-accordion antsand-container"
    },
    "accordian_heading_container": {
      "css_class": "antsand-accordion-header"
    },
    "accordian_title": {
      "css_class": "antsand-accordion-title"
    },
    "sub_container": {
      "css_class": "antsand-accordion-body"
    },
    "p": {
      "css_class": "antsand-text-base"
    }
  }
}
```

**Result**: Collapsible accordion with Q&A layout

---

### Pattern 10: Footer Multi-Column (Footer-1)
**SVG**: `/builds/production/images/concept2design/footer-1.svg`

**CSS Configuration**:
```json
{
  "footer": {
    "section": {
      "css_class": "antsand-footer antsand-footer-dark antsand-section"
    },
    "container": {
      "css_class": "antsand-footer-columns antsand-grid antsand-grid-4"
    },
    "title": {
      "css_class": "antsand-footer-title"
    },
    "description": {
      "css_class": "antsand-footer-link"
    },
    "social_container": {
      "css_class": "antsand-footer-social"
    },
    "social": {
      "css_class": "antsand-btn antsand-btn-outline-light antsand-btn-sm"
    }
  }
}
```

**Result**: 4-column footer with logo, links, social icons, dark background

---

## 🔄 Common CSS Patterns

### Column Layouts
```json
// 1 Column (Full Width)
"data": {
  "container": {
    "css_class": "antsand-container"
  }
}

// 2 Columns (50/50 Split)
"data": {
  "container": {
    "css_class": "antsand-grid antsand-grid-2"
  }
}

// 3 Columns (Equal Width)
"data": {
  "container": {
    "css_class": "antsand-grid antsand-grid-3"
  }
}

// 4 Columns (Grid)
"data": {
  "container": {
    "css_class": "antsand-grid antsand-grid-4"
  }
}

// Auto-fit Columns
"data": {
  "container": {
    "css_class": "antsand-grid antsand-grid-auto"
  }
}
```

### Alignment
```json
// Center Everything
"header": {
  "section": {
    "css_class": "antsand-text-center"
  }
}

// Vertical Center
"data": {
  "container": {
    "css_class": "antsand-d-flex antsand-flex-align-center"
  }
}

// Horizontal + Vertical Center
"header": {
  "container": {
    "css_class": "antsand-d-flex antsand-flex-center"
  }
}
```

### Spacing
```json
// Section Spacing (Top/Bottom Padding)
"section": {
  "container": {
    "css_class": "antsand-section"  // Adds 4rem padding
  }
}

// Extra Spacing
"header": {
  "h1": {
    "css_class": "antsand-mb-8"  // 4rem bottom margin
  }
}

// Compact Spacing
"data": {
  "p": {
    "css_class": "antsand-mb-2"  // 1rem bottom margin
  }
}
```

### Card Patterns
```json
// Basic Card
"data": {
  "sub_container": {
    "css_class": "antsand-card antsand-p-5"
  }
}

// Card with Hover Effect
"data": {
  "sub_container": {
    "css_class": "antsand-card antsand-card-hover antsand-p-5"
  }
}

// Card with Shadow
"data": {
  "sub_container": {
    "css_class": "antsand-card antsand-shadow-lg antsand-p-5"
  }
}
```

### Background Variants
```json
// Primary Background
"header": {
  "section": {
    "css_class": "antsand-bg-primary antsand-text-white"
  }
}

// Light Background
"section": {
  "container": {
    "css_class": "antsand-bg-light"
  }
}

// Dark Background
"footer": {
  "section": {
    "css_class": "antsand-bg-dark antsand-text-white"
  }
}
```

---

## 📋 Quick Reference: SVG to CSS Class Mapping

| SVG Template | Section Type | Key Classes |
|--------------|--------------|-------------|
| intro-1.svg | Hero Centered | `antsand-hero-centered`, `antsand-text-center` |
| intro-3.svg | Hero Split | `antsand-hero-split`, `antsand-grid-2` |
| features-1.svg | Feature Grid | `antsand-grid-3`, `antsand-card` |
| about-2.svg | Alternating | `antsand-grid-2`, `flip: true` |
| pricing-1.svg | Pricing Cards | `antsand-pricing-card`, `antsand-grid-3` |
| blog-1.svg | Blog Grid | `antsand-card`, `antsand-grid-3` |
| contact-1.svg | Contact Form | `antsand-grid-2`, `antsand-card` |
| team-1.svg | Team Grid | `antsand-grid-4`, `antsand-rounded-circle` |
| faq-1.svg | Accordion | `antsand-accordion` |
| footer-1.svg | Footer | `antsand-footer-dark`, `antsand-grid-4` |

---

## 🎯 How to Use in Databoard

1. **Select a template SVG** from the library
2. **The template references** a `parameters_file` (e.g., "service-3-data-css")
3. **Apply CSS classes** to header/body/footer based on the pattern above
4. **Same Volt structure** = different visual result

### Example Workflow:
```javascript
// User clicks "Intro 3" template in databoard
// System loads:
{
  "phalcon_template": "/antsand_bootstrap/project/common_views/intro_banner/intro-9.volt",
  "parameters_file": "service-3-data-css",
  "css": {
    "header": {
      "column_count": { "flip": true },
      "section": { "css_class": "antsand-hero antsand-hero-split" }
    }
  }
}

// Result: Same Volt structure, different CSS = Split hero layout
```

---

## 🚀 Pro Tips

1. **Start with a base pattern** (Hero, Grid, Split) and customize with utilities
2. **Use `antsand-section`** for consistent vertical spacing
3. **Combine classes** for complex layouts: `antsand-grid antsand-grid-3 antsand-flex-align-center`
4. **Leverage column_count** for responsive layouts without custom CSS
5. **Use card classes** for consistent elevation and spacing

---

## 📚 Related Files

- **Volt Templates**: `/app/antsand_bootstrap/project/common_views/`
- **CSS Init**: `/app/antsand_bootstrap/project/common_views/common/common_init_modern.volt`
- **Template Library**: `/app/antsand_bootstrap/project/common_views/outline2design.json`
- **ANTSAND v2 Styles**: `/styles_antsand/`
- **Databoard Canvas**: `/app/backend/databoard/js/canvas.module.js`

---

Built with ❤️ for the ANTSAND Databoard
*"One structure, infinite designs"*
