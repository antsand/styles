# ANTSAND DSL Template Library

This directory contains DSL (Domain Specific Language) templates for the ANTSAND ecosystem. Each template combines:

- **Data Structure**: The JSON schema that defines what content the template expects
- **Styling**: CSS classes and inline styles for appearance
- **Template Reference**: The .volt file that renders the component

## Directory Structure

```
dsl_templates/
├── index.json              # Master catalog of all templates
├── README.md               # This file
├── footer/                 # Footer section templates
│   ├── footer-modern-4col.dsl.json
│   ├── footer-minimal-centered.dsl.json
│   └── footer-simple-dark.dsl.json
├── hero/                   # Hero/intro section templates
│   ├── hero-gradient-cta.dsl.json
│   └── hero-split-image.dsl.json
├── features/               # Feature showcase templates
│   └── features-3-column.dsl.json
├── header/                 # Navigation header templates
├── services/               # Service listing templates
├── pricing/                # Pricing table templates
├── contact/                # Contact form templates
└── blog/                   # Blog listing templates
```

## Template JSON Structure

Each `.dsl.json` file follows this structure:

```json
{
  "template_id": "unique-id",
  "template_name": "Human Readable Name",
  "category": "footer|hero|features|etc",
  "description": "What this template does...",
  "preview_image": "/path/to/preview.png",
  "tags": ["searchable", "tags"],
  "version": "1.0",
  "author": "ANTSAND",
  "created": "2025-12-07",

  "volt_template": "/path/to/template.volt",
  "scss_file": "styles_antsand/sass/file.scss",

  "schema": {
    "description": "Documents expected data structure",
    "body": {
      // JSON schema for body data
    }
  },

  "dsl": {
    "name": "Section Name",
    "phalcon_template": "/path/to/template.volt",
    "css": {
      // CSS class and inline style mappings
    },
    "body": {
      // Default content that can be customized
    }
  }
}
```

## Usage

### In styles_doc (Template Browser)
styles_doc reads these templates and displays them in a visual catalog where users can:
- Browse by category
- Preview live rendered components
- Copy the DSL JSON
- Send to Databoard

### In Databoard (Page Builder)
Users can:
1. Open Template Library panel
2. Browse/search templates
3. Click "Use This" to insert the template's DSL into a section
4. Customize the content and styling

### Direct API Access
```
GET /api/templates                  # List all templates
GET /api/templates/{category}       # List by category
GET /api/template/{template_id}     # Get single template
```

## Creating New Templates

1. Create a new `.dsl.json` file in the appropriate category folder
2. Follow the JSON structure above
3. Add the template path to `index.json`
4. Create a preview image (optional but recommended)

### Template ID Convention
Use lowercase with hyphens: `{category}-{style}-{variant}`
Examples: `footer-modern-4col`, `hero-gradient-cta`, `features-icon-grid`

## Relationship to Other Components

```
styles_antsand/
├── sass/              ← SCSS source files (styling)
├── css/               ← Compiled CSS
├── dsl_templates/     ← THIS: Data + CSS + Template reference
└── components/        ← Component SCSS partials

app/antsand_bootstrap/project/common_views/
└── *.volt             ← Phalcon templates that render DSL

styles_doc/
└── (UI to browse templates)

databoard/
└── (Consumes templates via DSL Editor)
```

## Version History

- **1.0** (2025-12-07): Initial release with footer, hero, and features templates
