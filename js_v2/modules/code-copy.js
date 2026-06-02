/**
 * ANTSAND Code Copy & Syntax Highlight
 *
 * - Auto-injects a copy button into every .antsand-code-preview header.
 * - Auto-highlights Python code blocks using syn-* token classes.
 * - Uses the Clipboard API with a graceful fallback for older browsers.
 *
 * CSS classes `.antsand-code-copy`, `.copied`, and `.syn-*` tokens are
 * defined in sass_v2/components/_code.scss.
 *
 * @version 1.1.0
 */

const COPY_LABEL = 'Copy';
const COPIED_LABEL = 'Copied!';
const COPIED_MS = 2000;

const PY_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);

const PY_BUILTINS = new Set([
    'abs', 'all', 'any', 'bin', 'bool', 'bytes', 'callable', 'chr', 'dict',
    'dir', 'divmod', 'enumerate', 'eval', 'filter', 'float', 'format',
    'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'hex', 'id', 'input',
    'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map',
    'max', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
    'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr',
    'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple',
    'type', 'vars', 'zip'
]);

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(code) {
    const rx = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\#[^\n]*)|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|(\b[A-Za-z_]\w*(?=\s*\())|(\b[A-Za-z_]\w*\b)|([ \t]+)|([^\s\w"'#]+)|(\n)/g;

    let out = '';
    let m;
    while ((m = rx.exec(code)) !== null) {
        const [full, str, cmt, num, fnCall, word, ws, op, nl] = m;
        if (str) out += `<span class="syn-str">${escHtml(str)}</span>`;
        else if (cmt) out += `<span class="syn-cmt">${escHtml(cmt)}</span>`;
        else if (num) out += `<span class="syn-num">${escHtml(num)}</span>`;
        else if (fnCall) out += `<span class="syn-fn">${escHtml(fnCall)}</span>`;
        else if (word) {
            if (PY_KEYWORDS.has(word)) out += `<span class="syn-kw">${escHtml(word)}</span>`;
            else if (PY_BUILTINS.has(word)) out += `<span class="syn-fn">${escHtml(word)}</span>`;
            else if (word === 'self') out += `<span class="syn-kw">${escHtml(word)}</span>`;
            else out += `<span class="syn-var">${escHtml(word)}</span>`;
        } else if (ws) out += ws;
        else if (op) out += `<span class="syn-op">${escHtml(op)}</span>`;
        else if (nl) out += '\n';
        else out += escHtml(full);
    }
    return out;
}

function detectLang(block) {
    const langEl = block.querySelector('code-language, .antsand-code-language');
    if (langEl) {
        const t = langEl.textContent.trim().toLowerCase();
        if (t === 'python' || t === 'py') return 'python';
    }

    const pre = block.querySelector('.antsand-code-pre');
    if (pre && pre.classList.contains('language-python')) return 'python';
    return null;
}

function highlightBlock(block) {
    const lang = detectLang(block);
    if (!lang) return false;

    const codeEl = block.querySelector('.antsand-code-pre code')
        || block.querySelector('.antsand-code-pre');
    if (!codeEl || codeEl.dataset.synHighlighted) return false;

    codeEl.dataset.plainText = codeEl.textContent;
    codeEl.dataset.synHighlighted = '1';

    if (lang === 'python') {
        codeEl.innerHTML = highlightPython(codeEl.textContent);
    }
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
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function createCopyButton() {
    const btn = document.createElement('button');
    btn.className = 'antsand-code-copy';
    btn.type = 'button';
    btn.textContent = COPY_LABEL;
    btn.setAttribute('aria-label', 'Copy code to clipboard');
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
        console.warn('ANTSAND code-copy: clipboard write failed', err);
    }
}

function initAllCodeCopy() {
    const blocks = document.querySelectorAll(
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

export { initAllCodeCopy, highlightPython };
