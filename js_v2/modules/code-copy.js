/**
 * ANTSAND Code Copy & Syntax Highlight
 *
 * - Auto-injects a copy button into every .antsand-code-preview header.
 * - Auto-highlights explicitly labelled Python, C, Bash and PHP code blocks using syn-* token classes.
 * - Uses the Clipboard API with a graceful fallback for older browsers.
 *
 * CSS classes `.antsand-code-copy`, `.copied`, and `.syn-*` tokens are
 * defined in sass_v2/components/_code.scss.
 *
 * @version 1.2.0
 */

const COPY_LABEL = 'Copy';
const COPIED_LABEL = 'Copied!';
const COPIED_MS = 2000;

import { highlightCode, highlightPython, normalizeCodeLanguage } from './syntax-highlight.js';

function detectLang(block) {
    const code = block.querySelector('.antsand-code-pre code');
    const pre = block.querySelector('.antsand-code-pre');
    for (const el of [code, pre, block]) {
        if (!el) continue;
        // Explicit plaintext or unsupported languages must not be guessed.
        if (el.hasAttribute('data-language')) return normalizeCodeLanguage(el.dataset.language);
        for (const cls of el.classList) {
            if (cls.startsWith('language-')) return normalizeCodeLanguage(cls.slice(9));
        }
    }
    const label = block.querySelector('code-language, .antsand-code-language');
    if (label) return normalizeCodeLanguage(label.textContent);
    // Compatibility for older article headers: "Python · example title".
    const title = block.querySelector('code-label, .antsand-code-label');
    return normalizeCodeLanguage(title?.textContent.split(/[·:—]/)[0] || '');
}

function highlightBlock(block) {
    const lang = detectLang(block);
    if (!lang) return false;

    const codeEl = block.querySelector('.antsand-code-pre code')
        || block.querySelector('.antsand-code-pre');
    if (!codeEl || codeEl.dataset.synHighlighted) return false;

    codeEl.dataset.plainText = codeEl.textContent;
    codeEl.dataset.synHighlighted = '1';

    codeEl.innerHTML = highlightCode(codeEl.textContent, lang);
    codeEl.dataset.syntaxLanguage = lang;
    return true;
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!copied) throw new Error('Copy was denied');
}

function createCopyButton() {
    const btn = document.createElement('button');
    btn.className = 'antsand-code-copy';
    btn.type = 'button';
    btn.textContent = COPY_LABEL;
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.setAttribute('aria-live', 'polite');
    return btn;
}

async function handleCopy(e) {
    const btn = e.currentTarget;
    const block = btn.closest('.antsand-code-preview, .antsand-code-block, code-section');
    if (!block) return;

    const codeEl = block.querySelector('.antsand-code-pre code')
        || block.querySelector('.antsand-code-pre');
    if (!codeEl) return;

    const text = codeEl.dataset.plainText || codeEl.textContent;

    try {
        await copyText(text);
        btn.textContent = COPIED_LABEL;
        btn.classList.add('copied');

        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
            btn.textContent = COPY_LABEL;
            btn.classList.remove('copied');
        }, COPIED_MS);
    } catch (err) {
        const range = document.createRange(); range.selectNodeContents(codeEl);
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        btn.textContent = 'Select to copy';
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => { btn.textContent = COPY_LABEL; }, COPIED_MS);
    }
}

function initAllCodeCopy(scope = document) {
    const blocks = scope.querySelectorAll(
        '.antsand-code-preview, .antsand-code-block, code-section.antsand-code-preview'
    );
    const results = [];

    blocks.forEach(block => {
        highlightBlock(block);

        if (block.querySelector('.antsand-code-copy')) return;

        const header = block.querySelector('.antsand-code-header, code-header');
        if (!header) return;

        const btn = createCopyButton();
        btn.addEventListener('click', handleCopy);
        header.appendChild(btn);
        results.push(btn);
    });

    return results;
}

export { initAllCodeCopy, highlightPython, highlightCode };
