# Code highlighting

The shared `code-copy.js` initializes labelled Sass v2 code blocks and retains the Copy button. `syntax-highlight.js` supplies a small dependency-free display lexer for Python, C, Bash and PHP. No code is executed and no CDN is contacted.

```html
<code-section class="antsand-code-block" data-language="python">
  <code-header class="antsand-code-header">
    <code-label class="antsand-code-label">Train one adapter</code-label>
    <code-language class="antsand-code-language">Python</code-language>
  </code-header>
  <pre class="antsand-code-pre" tabindex="0"><code>loss.backward()</code></pre>
</code-section>
```

Escape source text server-side, including `<`, `>` and `&`. Prefer the renderer's structured `code_block.language` and `code_block.code` fields; no token spans need to be stored in Notes or Databoard.

Detection: `data-language` or `language-*` class on code/pre/block, then language label. Older headings beginning `Python ·`, `C ·`, `Bash ·` or `PHP ·` also work. Aliases: py, h, sh, shell. Explicit unknown languages or `text` remain plain. Do not mark console output as Python.

Colours are supplied by `_code.scss`; existing dark/light/terminal themes remain supported. `.antsand-code-block-themed` uses `--antsand-syntax-keyword/string/comment/function/number/operator`; docs light/dark palettes set these alongside surface colours.

This is lexical highlighting, not validation: nested interpolations, Bash heredocs and PHP heredocs are not parsed in depth. Source text and whitespace are preserved, including incomplete examples and Unicode. Blocks over 200,000 characters stay plain. JavaScript-off output is the original readable code. Copy uses the original source, without colour markup.

## Equations and recorded output

Use `data-language="math"` for matrix equations and `data-language="output"` for numerical logs. Math mode colours gradient notation, matrix names, operators, scalars, numbers and comments without changing the equation text. Output mode colours numbers, gradient labels and status words; it does not imply that the output is executable Python. Both reuse the same Sass v2 semantic token palette and original-source Copy behavior. These are display categories, not a mathematical parser or validation of reported results.

## JSON

Set `data-language="json"` (or `code_block.language: "json"` in structured renderer data). Keys, string values, numbers, booleans/null and punctuation are highlighted separately. The highlighter does not reformat or parse JSON, so exact copied text and large numbers are preserved. Format authoring content with indentation before publishing when desired. Invalid/incomplete snippets remain displayable; highlighting is not validation.
