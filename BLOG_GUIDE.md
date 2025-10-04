# ANTSAND Blog & Article Styles Guide

**New in v2.1**: Typography and Callout components for beautiful blog content

---

## 🎯 The Wrapper/Container Pattern

### Full-Width Sections with Bounded Content

The **critical pattern** for professional-looking websites:

```html
<!-- ✅ CORRECT: Full-width background, bounded content -->
<section class="antsand-section" style="background: #3498db;">
    <div class="antsand-container">
        <h1>Launch Your Product with Confidence</h1>
        <p>Everything you need to build, launch, and grow your business.</p>
        <button class="antsand-btn antsand-btn-primary">Start Free Trial</button>
    </div>
</section>

<!-- ❌ WRONG: Content stretches full width -->
<section class="antsand-section" style="background: #3498db;">
    <h1>Launch Your Product with Confidence</h1>
    <p>Everything you need...</p>
</section>
```

### Container Classes

```scss
.antsand-container       // Responsive: 640px → 768px → 1024px → 1280px
.antsand-container-fluid // Full-width with padding
```

### Max-Width Utilities (NEW)

For centering specific content without full container:

```html
<!-- Center content at 1024px max -->
<div class="antsand-max-w-lg antsand-mx-auto">
    Content centered at 1024px
</div>

<!-- Available widths -->
.antsand-max-w-sm        // 640px
.antsand-max-w-md        // 768px
.antsand-max-w-lg        // 1024px - Your screenshot sweet spot!
.antsand-max-w-xl        // 1280px
.antsand-max-w-prose     // 700px - Optimal reading width
.antsand-max-w-full      // 100%
.antsand-max-w-none      // Remove max-width

.antsand-mx-auto         // Horizontal center (margin-left/right: auto)
```

---

## 📝 Article/Blog Components

### 1. Simple Article

```html
<article class="antsand-article">
    <h1>Why I Use Linux and C in 2024</h1>

    <p>
        When I tell other developers I use Linux and write C code,
        they look at me like I'm crazy. Here's why I'm not.
    </p>

    <h2>The Performance Reality</h2>

    <p>
        Let's talk numbers. When I implemented GPT-2 in pure C,
        it ran circles around the Python version.
    </p>

    <blockquote>
        The fastest code is the code that understands hardware.
    </blockquote>

    <h3>Memory Management Matters</h3>

    <ul>
        <li>Manual memory control</li>
        <li>No garbage collector pauses</li>
        <li>Predictable performance</li>
    </ul>

    <pre><code>// Example C code
void* fast_malloc(size_t size) {
    return aligned_alloc(64, size);
}</code></pre>
</article>
```

**Styled automatically:**
- Paragraphs: 18px, 1.75 line-height, 24px bottom margin
- Headings: Bold, proper hierarchy
- First paragraph: Larger (20px lead text)
- H2: Bottom border for visual separation
- Blockquotes: Left border, italic, larger text
- Code: Gray background, monospace, red color
- Lists: Proper spacing
- Images: Responsive, rounded corners

### 2. Wide Article (for visuals)

```html
<article class="antsand-article-wide">
    <!-- 1000px max-width for infographics, charts -->
    <img src="architecture-diagram.png" alt="System Architecture">
    <p>Our distributed architecture handles...</p>
</article>
```

### 3. Research Paper

```html
<article class="antsand-research">
    <!-- 900px max-width, tighter typography for data -->
    <h1>Electric Vehicles: The Real Environmental Cost</h1>

    <p>
        A comprehensive analysis of EV supply chains reveals...
    </p>

    <div class="antsand-callout antsand-callout-sources">
        <h4>📚 Research Transparency</h4>
        <p>All 47 sources cited below. Methodology documented.</p>
        <ol>
            <li>Smith, J. (2024). Lithium Mining Impact Study</li>
            <li>Johnson, K. (2023). Battery Production Emissions</li>
        </ol>
    </div>
</article>
```

---

## 💬 Callout Boxes

### Available Variants

```html
<!-- Info (blue) -->
<div class="antsand-callout antsand-callout-info">
    <h4>💡 Pro Tip</h4>
    <p>Use semantic classes for consistency across your site.</p>
</div>

<!-- Warning (yellow/orange) -->
<div class="antsand-callout antsand-callout-warning">
    <h4>⚠️ Important</h4>
    <p>This approach requires careful consideration of edge cases.</p>
</div>

<!-- Success (green) -->
<div class="antsand-callout antsand-callout-success">
    <h4>✅ Best Practice</h4>
    <p>Always validate user input on both client and server.</p>
</div>

<!-- Danger (red) -->
<div class="antsand-callout antsand-callout-danger">
    <h4>🚨 Security Warning</h4>
    <p>Never store passwords in plain text.</p>
</div>

<!-- Sources (for research) -->
<div class="antsand-callout antsand-callout-sources">
    <h4>📚 Sources</h4>
    <ol>
        <li>Research paper citation</li>
        <li>Data source reference</li>
    </ol>
</div>

<!-- Note (neutral gray) -->
<div class="antsand-callout antsand-callout-note">
    <h4>📝 Note</h4>
    <p>Additional context or explanation.</p>
</div>
```

---

## 🎨 Article Header Pattern

Separate hero section for article metadata:

```html
<header class="antsand-article-header">
    <span class="antsand-badge antsand-badge-primary">Technical</span>

    <h1 class="antsand-article-title">
        Why Linux and C in 2024
    </h1>

    <p class="antsand-article-subtitle">
        The industry moved to macOS and high-level languages.
        Here's why I stayed with the fundamentals.
    </p>

    <div class="antsand-article-meta">
        <span>Oct 15, 2024</span>
        <span>12 min read</span>
        <span>47 sources</span>
    </div>
</header>

<article class="antsand-article">
    <!-- Article content here -->
</article>
```

---

## 🏗️ Complete Page Example

**Full-width sections + bounded content:**

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand.css">
</head>
<body>
    <!-- Hero: Full-width blue, content centered at 1024px -->
    <section class="antsand-section" style="background: #3498db; color: white;">
        <div class="antsand-container">
            <h1 class="antsand-text-4xl antsand-mb-3">Launch Your Product with Confidence</h1>
            <p class="antsand-text-lg antsand-mb-5">
                Everything you need to build, launch, and grow your business.
                Start your free trial today.
            </p>
            <button class="antsand-btn antsand-btn-primary">Start Free Trial</button>
            <button class="antsand-btn antsand-btn-secondary">Watch Demo</button>
        </div>
    </section>

    <!-- Features: Full-width gray background -->
    <section class="antsand-section" style="background: #f8f9fa;">
        <div class="antsand-container">
            <h2 class="antsand-text-3xl antsand-text-center antsand-mb-6">
                Powerful Features Built for You
            </h2>

            <div class="antsand-grid antsand-grid-3 antsand-gap-4">
                <div class="antsand-card antsand-card-shadow">
                    <div class="antsand-card-body">
                        <h3>Lightning Fast</h3>
                        <p>Optimized performance that scales with your business.</p>
                    </div>
                </div>
                <!-- More cards... -->
            </div>
        </div>
    </section>

    <!-- Blog Article: White background, reading width -->
    <article class="antsand-article antsand-py-8">
        <h1>Why This Matters</h1>

        <p>
            First paragraph is automatically larger (lead text).
            Perfect reading experience at 700px width.
        </p>

        <h2>The Details</h2>

        <p>Regular paragraph with comfortable 18px font size.</p>

        <div class="antsand-callout antsand-callout-info">
            <h4>💡 Key Insight</h4>
            <p>This is what makes all the difference.</p>
        </div>
    </article>

    <!-- CTA: Full-width blue -->
    <section class="antsand-section" style="background: #3498db; color: white;">
        <div class="antsand-container antsand-text-center">
            <h2 class="antsand-text-3xl antsand-mb-4">Join Thousands of Happy Customers</h2>
            <p class="antsand-text-lg antsand-mb-5">
                Trusted by leading companies worldwide.
            </p>
            <button class="antsand-btn antsand-btn-primary">Get Started Now</button>
        </div>
    </section>
</body>
</html>
```

---

## 🎯 Databoard Integration

### Using in SASS Editor

The SASS editor (`sassEditor.module.js`) can generate utility classes from your databoard:

```json
{
  "css_class": "flex gap-3 justify-center items-center p-4"
}
```

Click **"Generate Utilities"** to auto-create SCSS for all utility classes found in your databoard.

### Wrapper Pattern in Databoard

```json
{
  "sections": [
    {
      "type": "hero",
      "css_class": "antsand-section",
      "css": {
        "section": {
          "background": "#3498db",
          "color": "white"
        }
      },
      "wrapper": {
        "css_class": "antsand-container"
      },
      "content": {
        "heading": "Launch Your Product",
        "text": "Everything you need..."
      }
    }
  ]
}
```

---

## 🧠 The ANTSAND Philosophy

### Maximum Impact, Minimum Code

**The Wrapper Class** - 80/20 rule in action:
- One class (`.antsand-container`)
- Makes the difference between amateur and professional
- Constrains content width
- Centers everything
- Responsive breakpoints

**Typography Component** - Content readability:
- One class (`.antsand-article`)
- Styles all child elements automatically
- Optimal reading experience
- No per-element classes needed

**Spectrum of Specificity:**
```
Generic                                    Specific
├──────────────────────────────────────────────────┤
utilities          components           patterns
(p-4, flex)     (.antsand-btn)      (.antsand-article)
```

Use the **minimum specificity** needed:
- Layout: Use utilities (`flex`, `gap-3`)
- Buttons: Use component (`.antsand-btn-primary`)
- Blog posts: Use pattern (`.antsand-article`)

---

## 📦 What You Get

### New Classes

**Components:**
- `.antsand-article` - Blog posts (700px)
- `.antsand-article-wide` - Visual content (1000px)
- `.antsand-research` - Research papers (900px)
- `.antsand-article-header` - Article metadata section
- `.antsand-callout` + variants - Note boxes

**Utilities:**
- `.antsand-max-w-{sm|md|lg|xl|prose|full|none}` - Max width constraints
- `.antsand-mx-auto` - Horizontal centering

### Automatic Styling

Inside `.antsand-article`:
- ✅ Paragraphs
- ✅ Headings (h1-h6)
- ✅ Blockquotes
- ✅ Code blocks
- ✅ Lists (ul, ol)
- ✅ Links
- ✅ Images
- ✅ Tables
- ✅ Horizontal rules

---

## 🚀 Quick Start

1. **Build the library:**
   ```bash
   make build-antsand-v2
   ```

2. **Include in your HTML:**
   ```html
   <link rel="stylesheet" href="/builds/production/css/antsand-v2/antsand.css">
   ```

3. **Use the pattern:**
   ```html
   <section class="antsand-section" style="background: #3498db;">
       <div class="antsand-container">
           <!-- Your content here (max-width: 1024px, centered) -->
       </div>
   </section>
   ```

4. **Write beautiful articles:**
   ```html
   <article class="antsand-article">
       <h1>Your Title</h1>
       <p>Your content...</p>
   </article>
   ```

---

**Built with ❤️ using the ANTSAND philosophy: Maximum impact, minimum code.**
