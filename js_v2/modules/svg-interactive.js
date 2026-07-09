/**
 * ANTSAND SVG Interactive Explainers
 *
 * Generic stepper/play/fullscreen controller for custom-element based SVG
 * explainers embedded in blog posts or Databoard sections.
 */

class AntsandSvgInteractive {
    constructor(root) {
        this.root = root;
        this.index = 0;
        this.timer = null;
        this.steps = this.readSteps();
        this.nodes = root.querySelectorAll('[data-svg-node], [data-svg-block], [data-svg-zone]');
        this.connectors = root.querySelectorAll('[data-svg-connector], [data-svg-arrow]');
        this.dots = root.querySelectorAll('[data-svg-dot]');
        this.bumpElements = root.querySelectorAll('[data-svg-bump]');
        this.canvas = root.querySelector('svg-interactive-canvas') || root;
        this.tooltip = this.ensureTooltip();

        if (!this.steps.length) {
            this.steps = this.stepsFromNodes();
        }

        this.bind();
        this.render();
        this.root.setAttribute('data-svg-interactive-init', 'true');
    }

    readSteps() {
        const inline = this.root.querySelector('script[type="application/json"][data-svg-steps]');
        if (inline) {
            try {
                return JSON.parse(inline.textContent.trim());
            } catch (error) {
                console.warn('ANTSAND SVG interactive: invalid steps JSON', error);
            }
        }

        const key = this.root.getAttribute('data-svg-steps-key');
        if (key && window.ANTSAND_SVG_INTERACTIVE_STEPS && Array.isArray(window.ANTSAND_SVG_INTERACTIVE_STEPS[key])) {
            return window.ANTSAND_SVG_INTERACTIVE_STEPS[key];
        }

        return [];
    }

    stepsFromNodes() {
        return Array.from(this.nodes).map((node, index) => ({
            stage: `Step ${index + 1}`,
            headline: node.getAttribute('data-title') || node.getAttribute('aria-label') || `Step ${index + 1}`,
            copy: node.getAttribute('data-copy') || '',
            tooltip: node.getAttribute('data-tooltip') || ''
        }));
    }

    ensureTooltip() {
        let tooltip = this.root.querySelector('svg-interactive-tooltip, [data-svg-tooltip]');
        if (!tooltip && document.createElement) {
            tooltip = document.createElement('svg-interactive-tooltip');
            tooltip.setAttribute('data-svg-tooltip', '');
            this.canvas.appendChild(tooltip);
        }
        return tooltip;
    }

    bind() {
        this.root.querySelectorAll('[data-svg-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-svg-action');
                this.handleAction(action);
            });
        });

        this.nodes.forEach((node, nodeIndex) => {
            node.addEventListener('click', () => {
                this.stop();
                this.index = this.nodeIndex(node, nodeIndex);
                this.render();
            });

            node.addEventListener('mouseenter', () => this.showTooltip(node, nodeIndex));
            node.addEventListener('mouseleave', () => this.hideTooltip());
        });

        document.addEventListener('fullscreenchange', () => {
            this.root.classList.toggle('is-fullscreen', document.fullscreenElement === this.root);
        });
    }

    handleAction(action) {
        if (action !== 'play') {
            this.stop();
        }

        if (action === 'next') {
            this.index = (this.index + 1) % this.steps.length;
        } else if (action === 'prev') {
            this.index = (this.index + this.steps.length - 1) % this.steps.length;
        } else if (action === 'reset' || action === 'restart') {
            this.index = 0;
        } else if (action === 'play') {
            this.togglePlay();
            return;
        } else if (action === 'fullscreen') {
            this.toggleFullscreen();
            return;
        }

        this.render();
    }

    togglePlay() {
        if (this.timer) {
            this.stop();
            return;
        }

        const interval = Number(this.root.getAttribute('data-svg-interval')) || 2600;
        this.timer = window.setInterval(() => {
            this.index = (this.index + 1) % this.steps.length;
            this.render();
        }, interval);
    }

    stop() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        if (this.root.requestFullscreen) {
            this.root.requestFullscreen();
        } else {
            this.root.classList.toggle('is-fullscreen');
        }
    }

    nodeIndex(node, fallback) {
        const value = node.getAttribute('data-svg-node')
            || node.getAttribute('data-svg-block')
            || node.getAttribute('data-svg-zone');
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : fallback;
    }

    connectorIndex(connector, fallback) {
        const value = connector.getAttribute('data-svg-connector')
            || connector.getAttribute('data-svg-arrow');
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : fallback + 1;
    }

    render() {
        if (!this.steps.length) {
            return;
        }

        const step = this.steps[this.index] || this.steps[0];
        this.setText('[data-svg-stage]', step.stage || `Step ${this.index + 1} of ${this.steps.length}`);
        this.setText('[data-svg-headline]', step.headline || '');
        this.setText('[data-svg-copy]', step.copy || '');
        this.setText('[data-svg-code]', step.code || '');

        if (step.stats) {
            Object.entries(step.stats).forEach(([key, value]) => {
                this.setText(`[data-svg-stat="${key}"]`, value);
            });
        }

        const activeNodes = Array.isArray(step.nodes)
            ? step.nodes.map(Number)
            : (Array.isArray(step.zones) ? step.zones.map(Number) : [this.index]);
        const activeConnectors = Array.isArray(step.connectors)
            ? step.connectors.map(Number)
            : (Array.isArray(step.arrows) ? step.arrows.map(Number) : [this.index]);

        this.nodes.forEach((node, fallback) => {
            const idx = this.nodeIndex(node, fallback);
            const active = activeNodes.includes(idx);
            const done = idx < Math.max(...activeNodes);
            node.classList.toggle('is-active', active);
            node.classList.toggle('is-done', done);
        });

        this.connectors.forEach((connector, fallback) => {
            const idx = this.connectorIndex(connector, fallback);
            const active = activeConnectors.includes(idx);
            const done = idx < this.index || activeConnectors.some(v => v > idx);
            const wasActive = connector.classList.contains('is-active');
            connector.classList.toggle('is-active', active);
            connector.classList.toggle('is-done', done);

            if (active && !wasActive) {
                connector.style.animation = 'none';
                connector.getBoundingClientRect();
                connector.style.animation = '';
            }
        });

        this.dots.forEach((dot, fallback) => {
            const value = Number(dot.getAttribute('data-svg-dot'));
            const idx = Number.isFinite(value) ? value : fallback;
            dot.classList.toggle('is-active', idx === this.index);
            dot.classList.toggle('is-done', idx < this.index);
            dot.setAttribute('fill', idx <= this.index ? 'var(--asi-accent, #5eead4)' : '#475569');
        });

        this.bumpElements.forEach(element => {
            element.classList.toggle('is-active', Boolean(step.bump));
        });
    }

    setText(selector, value) {
        const target = this.root.querySelector(selector);
        if (target !== null && value !== undefined && value !== null) {
            target.textContent = String(value);
        }
    }

    showTooltip(node, fallback) {
        if (!this.tooltip) {
            return;
        }

        const idx = this.nodeIndex(node, fallback);
        const step = this.steps[idx] || {};
        const text = node.getAttribute('data-tooltip') || step.tooltip || '';
        if (!text) {
            return;
        }

        this.tooltip.textContent = text;
        const canvasRect = this.canvas.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        this.tooltip.style.left = `${Math.max(8, nodeRect.left - canvasRect.left + nodeRect.width / 2 - 100)}px`;
        this.tooltip.style.top = `${Math.max(8, nodeRect.top - canvasRect.top - 34)}px`;
        this.tooltip.classList.add('is-visible');
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('is-visible');
        }
    }
}

function initAllSvgInteractive() {
    const roots = document.querySelectorAll('[data-antsand-svg-interactive]:not([data-svg-interactive-init])');
    return Array.from(roots).map(root => new AntsandSvgInteractive(root));
}

export { AntsandSvgInteractive, initAllSvgInteractive };
