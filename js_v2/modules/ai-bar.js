/**
 * ANTSAND AI Bar Module (ES6)
 *
 * Adds "Copy for AI" and "View as Markdown" behavior to any generated
 * Header/Body/Footer section. The template only emits data-ai-bar; this module
 * owns target resolution, markdown conversion, clipboard, and toast behavior.
 */

let toastEl = null;
let toastTimer = null;

function cleanClone(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('[data-ai-exclude], .antsand-ai-bar, .antsand-ai-bar__md-view, script, style, nav').forEach((node) => {
        node.remove();
    });
    return clone;
}

function tableToMarkdown(tableEl) {
    const rows = tableEl.querySelectorAll('tr');
    if (!rows.length) return '';

    let md = '';
    let headerDone = false;

    rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        md += `| ${Array.from(cells).map((cell) => cell.textContent.trim()).join(' | ')} |\n`;

        if (!headerDone && row.querySelector('th')) {
            md += `| ${Array.from(cells).map(() => '---').join(' | ')} |\n`;
            headerDone = true;
        }
    });

    return md;
}

function htmlToMarkdown(element) {
    if (!element) return '';

    let md = '';
    element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            md += node.textContent;
            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const tag = node.tagName.toLowerCase();
        let inner = htmlToMarkdown(node);

        switch (tag) {
            case 'h1': md += `\n# ${inner.trim()}\n\n`; break;
            case 'h2': md += `\n## ${inner.trim()}\n\n`; break;
            case 'h3': md += `\n### ${inner.trim()}\n\n`; break;
            case 'h4': md += `\n#### ${inner.trim()}\n\n`; break;
            case 'h5': md += `\n##### ${inner.trim()}\n\n`; break;
            case 'h6': md += `\n###### ${inner.trim()}\n\n`; break;
            case 'p': md += `${inner.trim()}\n\n`; break;
            case 'br': md += '\n'; break;
            case 'hr': md += '\n---\n\n'; break;
            case 'strong':
            case 'b': md += `**${inner}**`; break;
            case 'em':
            case 'i': md += `*${inner}*`; break;
            case 'del':
            case 's': md += `~~${inner}~~`; break;
            case 'code':
                md += node.parentElement?.tagName.toLowerCase() === 'pre' ? inner : `\`${inner}\``;
                break;
            case 'pre': {
                const codeEl = node.querySelector('code');
                let lang = '';
                if (codeEl) {
                    lang = codeEl.getAttribute('data-lang') || '';
                    const match = !lang && codeEl.className ? codeEl.className.match(/language-(\w+)/) : null;
                    if (match) lang = match[1];
                    inner = codeEl.textContent;
                }
                md += `\n\`\`\`${lang}\n${inner.trim()}\n\`\`\`\n\n`;
                break;
            }
            case 'a': {
                const href = node.getAttribute('href') || '';
                md += href ? `[${inner}](${href})` : inner;
                break;
            }
            case 'img': {
                const alt = node.getAttribute('alt') || '';
                const src = node.getAttribute('src') || '';
                md += src ? `![${alt}](${src})` : '';
                break;
            }
            case 'ul':
                md += '\n';
                node.querySelectorAll(':scope > li').forEach((li) => {
                    md += `- ${htmlToMarkdown(li).trim()}\n`;
                });
                md += '\n';
                break;
            case 'ol': {
                let index = 1;
                md += '\n';
                node.querySelectorAll(':scope > li').forEach((li) => {
                    md += `${index}. ${htmlToMarkdown(li).trim()}\n`;
                    index += 1;
                });
                md += '\n';
                break;
            }
            case 'li':
                md += inner;
                break;
            case 'blockquote':
                md += `\n${inner.trim().split('\n').map((line) => `> ${line}`).join('\n')}\n\n`;
                break;
            case 'table':
                md += `\n${tableToMarkdown(node)}\n`;
                break;
            default:
                md += inner;
        }
    });

    return md;
}

function normalizeMarkdown(markdown) {
    return markdown.replace(/\n{3,}/g, '\n\n').trim();
}

function buildAIContext(element, options = {}) {
    const title = options.title || document.title;
    const url = options.url || window.location.href;
    const markdown = normalizeMarkdown(htmlToMarkdown(cleanClone(element)));
    return `# ${title}\nSource: ${url}\n\n${markdown}`.trim();
}

function showToast(message) {
    if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'antsand-ai-bar__toast';
        document.body.appendChild(toastEl);
    }

    toastEl.textContent = `✓ ${message}`;
    toastEl.classList.add('antsand-ai-bar__toast--visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('antsand-ai-bar__toast--visible');
    }, 2000);
}

function fallbackCopy(text, message) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showToast(message);
    } catch (error) {
        showToast('Copy failed - use Ctrl+C');
    }

    textarea.remove();
}

function copyToClipboard(text, message = 'Copied for AI') {
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(message))
            .catch(() => fallbackCopy(text, message));
        return;
    }
    fallbackCopy(text, message);
}

function resolveTarget(bar) {
    const target = bar.getAttribute('data-ai-target') || 'section';
    if (target === 'section' || target === 'closest') {
        return bar.closest('section, .antsand-section, [data-ai-content]') || bar.parentElement;
    }
    if (target === 'next') {
        return bar.nextElementSibling;
    }
    return document.querySelector(target);
}

function renderDefaultButtons(bar) {
    if (bar.children.length) return;
    bar.innerHTML = `
        <button class="antsand-ai-bar__action" type="button" data-ai-action="copy">
            <span class="antsand-ai-bar__action-icon" aria-hidden="true">📋</span> Copy for AI
        </button>
        <span class="antsand-ai-bar__divider"></span>
        <button class="antsand-ai-bar__action" type="button" data-ai-action="markdown">
            <span class="antsand-ai-bar__action-icon" aria-hidden="true">📄</span> View as Markdown
        </button>`;
}

function toggleMarkdownView(target, bar, button) {
    const container = target.parentElement || bar.parentElement;
    let view = container.querySelector(':scope > .antsand-ai-bar__md-view');

    if (view?.classList.contains('antsand-ai-bar__md-view--visible')) {
        view.classList.remove('antsand-ai-bar__md-view--visible');
        target.style.display = '';
        button?.classList.remove('antsand-ai-bar__action--active');
        return;
    }

    const markdown = normalizeMarkdown(htmlToMarkdown(cleanClone(target)));
    if (!view) {
        view = document.createElement('div');
        view.className = 'antsand-ai-bar__md-view';
        view.innerHTML = `
            <div class="antsand-ai-bar__md-view-actions">
                <button class="antsand-ai-bar__md-view-copy" type="button">📋 Copy</button>
                <button class="antsand-ai-bar__md-view-close" type="button" aria-label="Close Markdown preview">✕ Close</button>
            </div>
            <pre></pre>`;
        view.querySelector('.antsand-ai-bar__md-view-copy').addEventListener('click', () => copyToClipboard(markdown, 'Markdown copied'));
        view.querySelector('.antsand-ai-bar__md-view-close').addEventListener('click', () => {
            view.classList.remove('antsand-ai-bar__md-view--visible');
            target.style.display = '';
            button?.classList.remove('antsand-ai-bar__action--active');
        });
        target.insertAdjacentElement('afterend', view);
    }

    view.querySelector('pre').textContent = markdown;
    view.classList.add('antsand-ai-bar__md-view--visible');
    target.style.display = 'none';
    button?.classList.add('antsand-ai-bar__action--active');
}

class AntsandAiBar {
    constructor(bar) {
        this.bar = typeof bar === 'string' ? document.querySelector(bar) : bar;
        if (!this.bar || this.bar.dataset.aiBarInit === 'true') return;

        this.target = resolveTarget(this.bar);
        if (!this.target) return;

        renderDefaultButtons(this.bar);
        this.bar.addEventListener('click', (event) => this.handleClick(event));
        this.bar.dataset.aiBarInit = 'true';
    }

    handleClick(event) {
        const button = event.target.closest('[data-ai-action]');
        if (!button) return;

        event.preventDefault();
        const action = button.getAttribute('data-ai-action');

        if (action === 'copy') {
            copyToClipboard(buildAIContext(this.target), 'Copied for AI');
        } else if (action === 'markdown') {
            toggleMarkdownView(this.target, this.bar, button);
        } else if (action === 'copy-raw') {
            const source = button.getAttribute('data-ai-source');
            const element = source ? document.querySelector(source) : this.target;
            if (element) copyToClipboard(element.value || element.textContent, 'Markdown source copied');
        }
    }
}

function initAllAiBars() {
    return Array.from(document.querySelectorAll('[data-ai-bar]'))
        .map((bar) => new AntsandAiBar(bar))
        .filter(Boolean);
}

export {
    AntsandAiBar,
    initAllAiBars,
    htmlToMarkdown,
    buildAIContext
};
