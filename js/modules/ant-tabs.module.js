/**
 * ANTSAND Tabs Module - ES6 Tab Navigation Component
 *
 * Features:
 * - Click to switch tabs
 * - Keyboard navigation (arrow keys, home/end)
 * - ARIA accessibility
 * - Change callbacks
 *
 * Usage:
 *   <div data-tabs>
 *     <div class="tabs-nav">
 *       <button data-tab="tab1" class="active">Tab 1</button>
 *       <button data-tab="tab2">Tab 2</button>
 *     </div>
 *     <div data-tab-panel="tab1" class="active">Content 1</div>
 *     <div data-tab-panel="tab2" hidden>Content 2</div>
 *   </div>
 */

export class AntTabs {
    constructor(element, options = {}) {
        this.container = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        if (!this.container) {
            console.warn('AntTabs: Container element not found');
            return;
        }

        this.options = {
            activeClass: 'active',
            keyboard: true,
            onChange: null,
            ...options
        };

        this.tabs = Array.from(this.container.querySelectorAll('[data-tab]'));
        this.panels = Array.from(this.container.querySelectorAll('[data-tab-panel]'));

        if (this.tabs.length === 0) {
            console.warn('AntTabs: No tabs found');
            return;
        }

        this.init();
    }

    init() {
        // Bind click events
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.activate(tab.dataset.tab);
            });

            // Set ARIA attributes
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', tab.classList.contains(this.options.activeClass) ? '0' : '-1');
        });

        // Bind keyboard navigation
        if (this.options.keyboard) {
            this.bindKeyboard();
        }

        // Set ARIA attributes on panels
        this.panels.forEach(panel => {
            panel.setAttribute('role', 'tabpanel');
        });

        // Activate first tab if none active
        const activeTab = this.tabs.find(t => t.classList.contains(this.options.activeClass));
        if (!activeTab && this.tabs[0]) {
            this.activate(this.tabs[0].dataset.tab);
        }

        this.container.dataset.tabsInit = 'true';
    }

    bindKeyboard() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('keydown', (e) => {
                let targetIndex;

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = index - 1;
                        if (targetIndex < 0) targetIndex = this.tabs.length - 1;
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = index + 1;
                        if (targetIndex >= this.tabs.length) targetIndex = 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = this.tabs.length - 1;
                        break;
                    default:
                        return;
                }

                this.tabs[targetIndex].focus();
                this.activate(this.tabs[targetIndex].dataset.tab);
            });
        });
    }

    activate(tabId) {
        // Update tab buttons
        this.tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle(this.options.activeClass, isActive);
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Update panels
        this.panels.forEach(panel => {
            const isActive = panel.dataset.tabPanel === tabId;
            panel.classList.toggle(this.options.activeClass, isActive);
            panel.hidden = !isActive;
        });

        // Callback
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(tabId);
        }

        // Dispatch event
        this.container.dispatchEvent(new CustomEvent('tabs:change', {
            detail: { tabId }
        }));
    }

    getActiveTab() {
        const activeTab = this.tabs.find(t => t.classList.contains(this.options.activeClass));
        return activeTab ? activeTab.dataset.tab : null;
    }

    destroy() {
        delete this.container.dataset.tabsInit;
    }
}

// Auto-init function
export function initAntTabs() {
    document.querySelectorAll('[data-tabs]:not([data-tabs-init])').forEach(el => {
        new AntTabs(el);
    });
}

export default AntTabs;
