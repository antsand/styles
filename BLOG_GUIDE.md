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

### Git PR and commit register

Use `.antsand-git-history` for an end-of-article, evidence-linked change
register. Keep the analysis in the prose; this is a navigable source appendix,
not a replacement for explaining results. Its children use
`.antsand-git-history__*` classes, native `<details>`/`<summary>` disclosure,
descriptive group names, and ordinary PR and commit links. Source of truth:
`sass_v2/components/_git-history.scss`.

For a Git-backed article, optionally put one
`<!-- ANTSAND_GIT_HISTORY_APPENDIX -->` marker in the source HTML and run
`node scripts/build_git_history_appendix.mjs --repo /path/to/repo --from
2026-09-01T00:00:00-07:00 --through 2026-09-30T23:59:59-07:00
--repository-url https://github.com/owner/repo --article source.html
--output rendered.html --register merged-prs.json --label 'September 2026'`.
Use `node scripts/build_git_history_appendix.mjs --help` for all options.
Without a marker, the generator appends the register; on a later run it
replaces the existing register rather than duplicating it. It never overwrites
the source file. Use the relevant dates and repository for your article. The
generator fails on unlinked or duplicate PRs, HTML-escapes titles, and writes
a JSON register for review. Check the title-based categories and claims
against the PRs before publishing. Do not infer model quality from a merge
title.

Build shared styles with `make build-antsand-v2` from the Antsand root. The
generated site must first exist through Databoard deployment; subsequent
`/antsand/saveallblog` or `/antsand/index` requests can checksum-sync the
compiled CSS. Verify `X-Antsand-Styles-Sync` and the served CSS instead of
copying files into the federated site. Once this shared component is deployed,
adding its HTML to another article is a content-only Notes update and data
refresh; there is no Sass rebuild or Databoard redeployment for each post.

### Reference snapshots for long-form Notes

Use a reference snapshot where a reader may want to follow a related article or
source and then return. It is an ordinary labeled list, not a JavaScript widget:
screen readers and reading agents can identify the group, announce each link's
purpose, open it, and return using browser history. Keep link text unique and
explain why each reference matters. Do not replace citations in the prose.

```html
<aside class="antsand-reference-snapshot" aria-labelledby="audio-reading">
    <h3 id="audio-reading">Follow the audio work</h3>
    <p>Earlier work that explains this result.</p>
    <ul>
        <li>
            <a href="/blog/123/audio-test">The audio test that found a bug</a>
            <p>Shows the original workload and the regression it exposed.</p>
        </li>
    </ul>
</aside>
```

Use a unique heading ID per snapshot. Put the snapshot near the argument it
supports, with a short end-of-article group only if a next-reading path is
useful. Use `.antsand-blog-callout` for an evidence boundary or warning, not
for a list of unexplained URLs. If styling is unavailable, both still read in
document order. Avoid opening references in a new tab by default so the
reader's Back action returns to the article.

For a future voice-reading agent, the heading and each link/summary are the
navigation contract: announce that related references are available, read the
title and purpose, and ask before opening one. Remember the source URL and
reading position so "go back" returns to the original article. Do not silently
follow every link or claim this workflow is already automated; the HTML makes
it possible to implement reliably.

Source of truth: `sass_v2/components/_blog-content.scss`. After review,
compile `sass_v2/antsand-v2.scss`, verify the generated CSS against pending
changes, sync to Antsand and styles_doc, test the local Notes rendering and
keyboard focus, then deploy the same tested stylesheet with the article. Do
not overwrite a dirty generated stylesheet without checking its diff.

### Side notes and pull quotes

Use a side note for one short observation that helps the current paragraph,
not for a second copy of the article. The shared variants are `--tint-blue`,
`--tint-rose`, `--tint-mint`, `--tint-green`, `--tint-amber`, and
`--tint-violet`; `--quote` and `--stat` select the content treatment.
`--tint-green` is a distinct, lighter green used by the Linux systems article.
Keep the content in document order and use an `<aside>` after the paragraph it
explains. The side rail starts at 1440px; below that it remains inline.

```html
<div class="blog-side-note-anchor">
    <p>The related article paragraph.</p>
    <aside class="blog-side-note blog-side-note--quote blog-side-note--tint-green"
           aria-label="Key idea">
        <div class="blog-side-note__card">
            <div class="blog-side-note__body">
                <span class="blog-side-note__label">Key idea</span>
                <p class="blog-side-note__text">One concise observation.</p>
            </div>
        </div>
    </aside>
</div>
```

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
