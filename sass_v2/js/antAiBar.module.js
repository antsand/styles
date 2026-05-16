/**
 * antAiBar.module.js — ANTSAND AI Action Bar
 * Stripe-inspired "Copy for LLM", "View as Markdown" actions
 *
 * Usage:
 *   <div class="antsand-ai-bar" data-ai-bar data-ai-target="#content">
 *     <!-- buttons auto-generated, or provide your own -->
 *   </div>
 *
 *   // Or manual:
 *   antAiBar.copyForLLM(element);
 *   antAiBar.viewAsMarkdown(element);
 */
(function(root) {
    'use strict';

    var antAiBar = {};
    var toastEl = null;
    var toastTimer = null;

    // --- HTML to Markdown converter ---
    function htmlToMarkdown(el) {
        if (!el) return '';

        var md = '';
        var nodes = el.childNodes;

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (node.nodeType === 3) {
                md += node.textContent;
                continue;
            }

            if (node.nodeType !== 1) continue;

            var tag = node.tagName.toLowerCase();
            var inner = htmlToMarkdown(node);

            switch (tag) {
                case 'h1': md += '\n# ' + inner.trim() + '\n\n'; break;
                case 'h2': md += '\n## ' + inner.trim() + '\n\n'; break;
                case 'h3': md += '\n### ' + inner.trim() + '\n\n'; break;
                case 'h4': md += '\n#### ' + inner.trim() + '\n\n'; break;
                case 'h5': md += '\n##### ' + inner.trim() + '\n\n'; break;
                case 'h6': md += '\n###### ' + inner.trim() + '\n\n'; break;
                case 'p': md += inner.trim() + '\n\n'; break;
                case 'br': md += '\n'; break;
                case 'hr': md += '\n---\n\n'; break;
                case 'strong':
                case 'b': md += '**' + inner + '**'; break;
                case 'em':
                case 'i': md += '*' + inner + '*'; break;
                case 'del':
                case 's': md += '~~' + inner + '~~'; break;
                case 'code':
                    if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
                        md += inner;
                    } else {
                        md += '`' + inner + '`';
                    }
                    break;
                case 'pre':
                    var lang = '';
                    var codeEl = node.querySelector('code');
                    if (codeEl) {
                        lang = codeEl.getAttribute('data-lang') || '';
                        if (!lang && codeEl.className) {
                            var m = codeEl.className.match(/language-(\w+)/);
                            if (m) lang = m[1];
                        }
                        inner = codeEl.textContent;
                    }
                    md += '\n```' + lang + '\n' + inner.trim() + '\n```\n\n';
                    break;
                case 'a':
                    var href = node.getAttribute('href') || '';
                    md += '[' + inner + '](' + href + ')';
                    break;
                case 'img':
                    var alt = node.getAttribute('alt') || '';
                    var src = node.getAttribute('src') || '';
                    md += '![' + alt + '](' + src + ')';
                    break;
                case 'ul':
                    var lis = node.querySelectorAll(':scope > li');
                    md += '\n';
                    lis.forEach(function(li) {
                        md += '- ' + htmlToMarkdown(li).trim() + '\n';
                    });
                    md += '\n';
                    break;
                case 'ol':
                    var olis = node.querySelectorAll(':scope > li');
                    var idx = 1;
                    md += '\n';
                    olis.forEach(function(li) {
                        md += idx + '. ' + htmlToMarkdown(li).trim() + '\n';
                        idx++;
                    });
                    md += '\n';
                    break;
                case 'li':
                    md += inner;
                    break;
                case 'blockquote':
                    var bqlines = inner.trim().split('\n');
                    md += '\n' + bqlines.map(function(l) { return '> ' + l; }).join('\n') + '\n\n';
                    break;
                case 'table':
                    md += '\n' + tableToMarkdown(node) + '\n';
                    break;
                default:
                    md += inner;
            }
        }

        return md;
    }

    function tableToMarkdown(tableEl) {
        var rows = tableEl.querySelectorAll('tr');
        if (!rows.length) return '';

        var md = '';
        var headerDone = false;

        rows.forEach(function(row) {
            var cells = row.querySelectorAll('th, td');
            var line = '| ' + Array.from(cells).map(function(c) {
                return c.textContent.trim();
            }).join(' | ') + ' |';

            md += line + '\n';

            if (!headerDone && row.querySelector('th')) {
                md += '| ' + Array.from(cells).map(function() {
                    return '---';
                }).join(' | ') + ' |\n';
                headerDone = true;
            }
        });

        return md;
    }

    // --- Build LLM context block ---
    function buildLLMContext(el, opts) {
        opts = opts || {};
        var title = opts.title || document.title;
        var url = opts.url || window.location.href;
        var md = htmlToMarkdown(el);

        md = md.replace(/\n{3,}/g, '\n\n').trim();

        var context = '# ' + title + '\n';
        context += 'Source: ' + url + '\n\n';
        context += md;

        return context;
    }

    // --- Clipboard ---
    function copyToClipboard(text, message) {
        message = message || 'Copied for LLM';

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showToast(message);
            }).catch(function() {
                fallbackCopy(text, message);
            });
        } else {
            fallbackCopy(text, message);
        }
    }

    function fallbackCopy(text, message) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast(message);
        } catch (e) {
            showToast('Copy failed — use Ctrl+C');
        }
        document.body.removeChild(ta);
    }

    function showToast(message) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'antsand-ai-bar__toast';
            document.body.appendChild(toastEl);
        }

        toastEl.textContent = '✓ ' + message;
        toastEl.classList.add('antsand-ai-bar__toast--visible');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toastEl.classList.remove('antsand-ai-bar__toast--visible');
        }, 2000);
    }

    // --- Actions ---
    function copyForLLM(targetEl, opts) {
        if (typeof targetEl === 'string') targetEl = document.querySelector(targetEl);
        if (!targetEl) return;
        copyToClipboard(buildLLMContext(targetEl, opts), 'Copied for LLM');
    }

    function viewAsMarkdown(targetEl, barEl) {
        if (typeof targetEl === 'string') targetEl = document.querySelector(targetEl);
        if (!targetEl) return;

        var container = barEl ? barEl.parentElement : targetEl.parentElement;
        var existing = container.querySelector('.antsand-ai-bar__md-view');

        // Toggle off
        if (existing && existing.classList.contains('antsand-ai-bar__md-view--visible')) {
            existing.classList.remove('antsand-ai-bar__md-view--visible');
            targetEl.style.display = '';
            return;
        }

        var md = htmlToMarkdown(targetEl);
        md = md.replace(/\n{3,}/g, '\n\n').trim();

        if (!existing) {
            existing = document.createElement('div');
            existing.className = 'antsand-ai-bar__md-view';

            var actions = document.createElement('div');
            actions.className = 'antsand-ai-bar__md-view-actions';

            var copyBtn = document.createElement('button');
            copyBtn.className = 'antsand-ai-bar__md-view-copy';
            copyBtn.textContent = '📋 Copy';
            copyBtn.addEventListener('click', function() {
                copyToClipboard(md, 'Markdown copied');
            });
            actions.appendChild(copyBtn);

            var closeBtn = document.createElement('button');
            closeBtn.className = 'antsand-ai-bar__md-view-close';
            closeBtn.type = 'button';
            closeBtn.textContent = '✕ Close';
            closeBtn.setAttribute('aria-label', 'Close Markdown preview');
            closeBtn.addEventListener('click', function() {
                existing.classList.remove('antsand-ai-bar__md-view--visible');
                targetEl.style.display = '';
            });
            actions.appendChild(closeBtn);

            existing.appendChild(actions);

            var pre = document.createElement('pre');
            existing.appendChild(pre);

            targetEl.parentElement.insertBefore(existing, targetEl.nextSibling);
        }

        existing.querySelector('pre').textContent = md;
        existing.classList.add('antsand-ai-bar__md-view--visible');
        targetEl.style.display = 'none';
    }

    function copyRawMarkdown(sourceEl) {
        if (typeof sourceEl === 'string') sourceEl = document.querySelector(sourceEl);
        if (!sourceEl) return;
        copyToClipboard(sourceEl.value || sourceEl.textContent, 'Markdown source copied');
    }

    // --- Auto-init ---
    function initBar(barEl) {
        var targetSel = barEl.getAttribute('data-ai-target');
        var targetEl = targetSel ? document.querySelector(targetSel) : barEl.nextElementSibling;
        if (!targetEl) return;

        // Populate empty bars with default buttons
        if (!barEl.children.length) {
            barEl.innerHTML =
                '<button class="antsand-ai-bar__action" data-ai-action="copy">' +
                    '<span class="antsand-ai-bar__action-icon">📋</span> Copy for LLM' +
                '</button>' +
                '<span class="antsand-ai-bar__divider"></span>' +
                '<button class="antsand-ai-bar__action" data-ai-action="markdown">' +
                    '<span class="antsand-ai-bar__action-icon">📄</span> View as Markdown' +
                '</button>';
        }

        barEl.querySelectorAll('[data-ai-action]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var action = btn.getAttribute('data-ai-action');

                if (action === 'copy') {
                    copyForLLM(targetEl);
                } else if (action === 'markdown') {
                    btn.classList.toggle('antsand-ai-bar__action--active');
                    viewAsMarkdown(targetEl, barEl);
                } else if (action === 'copy-raw') {
                    var rawSel = btn.getAttribute('data-ai-source');
                    copyRawMarkdown(rawSel || targetEl);
                }
            });
        });
    }

    function init() {
        document.querySelectorAll('[data-ai-bar]').forEach(function(bar) {
            initBar(bar);
        });
    }

    // --- Public API ---
    antAiBar.init = init;
    antAiBar.initBar = initBar;
    antAiBar.copyForLLM = copyForLLM;
    antAiBar.viewAsMarkdown = viewAsMarkdown;
    antAiBar.copyRawMarkdown = copyRawMarkdown;
    antAiBar.htmlToMarkdown = htmlToMarkdown;
    antAiBar.showToast = showToast;

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = antAiBar;
    } else {
        root.antAiBar = antAiBar;
    }

})(typeof window !== 'undefined' ? window : this);
