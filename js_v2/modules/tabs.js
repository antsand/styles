/**
 * ANTSAND Tabs Module (ES6)
 *
 * Follows ANTSAND Universal Structure:
 * - Parent class controls variant styling (antsand-tabs-pills, antsand-tabs-steps, etc.)
 * - Child classes are consistent: .tabs-header, .tabs-item, .tabs-content
 *
 * =====================================================================
 * FEATURE-BASED ACTIVATION (preferred)
 * =====================================================================
 * Any template can enable tabs via CSS config: "feature": "tabs" or "feature": "tabs-pills"
 * Volt auto-generates:
 *   data-feature="tabs"
 *   data-tabs="true"
 *   data-tabs-variant="pills"
 *
 * =====================================================================
 * DEDICATED TABS COMPONENT
 * =====================================================================
 * HTML Structure (consistent across all variants):
 * <div class="antsand-tabs-{variant}" data-tabs>
 *   <div class="tabs-header">
 *     <button class="tabs-item active" data-tab="tab1">Tab 1</button>
 *     <button class="tabs-item" data-tab="tab2">Tab 2</button>
 *   </div>
 *   <div class="tabs-content active" id="tab1">Content 1</div>
 *   <div class="tabs-content" id="tab2">Content 2</div>
 * </div>
 *
 * Variants (parent class only changes):
 * - antsand-tabs-pills    : Rounded gradient backgrounds
 * - antsand-tabs-steps    : Sequential workflow steps
 * - antsand-tabs-vertical : Sidebar navigation
 * - antsand-tabs-underline: Minimal bottom border
 * - antsand-tabs-boxed    : Card-style with borders
 */

class AntsandTabs {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.warn('AntsandTabs: Container not found');
            return;
        }

        // Check if already initialized
        if (this.container.dataset.tabsInit === 'true') {
            return;
        }

        // Detect if this is a feature-activated tabs or dedicated component
        this.isFeatureActivated = this.container.dataset.feature === 'tabs' ||
                                   this.container.dataset.tabs === 'true';

        // Get variant from data-tabs-variant attribute if set
        this.variant = this.container.dataset.tabsVariant || '';

        // Get section index for debugging/targeting
        this.sectionIndex = this.container.dataset.sectionIndex || null;

        this.tabsHeader = this.container.querySelector('.tabs-header');
        this.tabs = this.container.querySelectorAll('.tabs-item');
        this.contents = this.container.querySelectorAll('.tabs-content');
        this.instanceId = this.container.id || `antsand-tabs-${Math.random().toString(36).slice(2, 10)}`;
        this.singlePaneMode = this.contents.length === 1 && this.tabs.length > 1;

        if (this.tabs.length === 0) {
            console.warn('AntsandTabs: No .tabs-item found in container');
            return;
        }

        this.init();
    }

    init() {
        // Bind click events
        this.tabs.forEach((tab, index) => {
            if (tab.tagName === 'BUTTON' && !tab.hasAttribute('type')) {
                tab.setAttribute('type', 'button');
            }
            if (!tab.dataset.tab) {
                const content = this.contents[index] || this.contents[0];
                if (content) {
                    content.id = content.id || `${this.instanceId}-panel-${index}`;
                    tab.dataset.tab = content.id;
                }
            }
            tab.addEventListener('click', (e) => this.handleTabClick(e, tab));
            tab.addEventListener('keydown', (e) => this.handleKeydown(e, tab));
        });

        // Set ARIA attributes
        this.setAccessibility();

        // Mark as initialized
        this.container.dataset.tabsInit = 'true';
    }

    handleTabClick(e, tab) {
        e.preventDefault();

        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Deactivate all tabs
        this.tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });

        // Activate clicked tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        // Some docs/demo sections use multiple tab buttons as style examples with
        // one shared content pane. Keep that pane visible instead of blanking it.
        const targetContent = this.singlePaneMode
            ? this.contents[0]
            : (document.getElementById(targetId) || this.contents[Array.from(this.tabs).indexOf(tab)] || this.contents[0]);

        if (!this.singlePaneMode) {
            this.contents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            });
        }

        // Activate target content
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.setAttribute('aria-hidden', 'false');

            // Dispatch custom event
            this.container.dispatchEvent(new CustomEvent('antsand:tab:changed', {
                detail: {
                    tabId: targetId,
                    tab: tab,
                    content: targetContent
                },
                bubbles: true
            }));
        }
    }

    handleKeydown(e, tab) {
        const tabArray = Array.from(this.tabs);
        const currentIndex = tabArray.indexOf(tab);
        let newIndex = null;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabArray.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = tabArray.length - 1;
                break;
        }

        if (newIndex !== null) {
            tabArray[newIndex].focus();
            tabArray[newIndex].click();
        }
    }

    setAccessibility() {
        // Set role on tabs header
        if (this.tabsHeader) {
            this.tabsHeader.setAttribute('role', 'tablist');
        }

        // Set roles on tabs
        this.tabs.forEach((tab, index) => {
            const isActive = tab.classList.contains('active');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');

            // Link to content panel
            const targetId = tab.dataset.tab;
            if (targetId) {
                tab.setAttribute('aria-controls', targetId);
            }
        });

        // Set roles on content panels
        this.contents.forEach(content => {
            const isActive = content.classList.contains('active');
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
    }

    // Public API: Switch to a specific tab by ID
    switchTo(tabId) {
        const tab = this.container.querySelector(`[data-tab="${tabId}"]`);
        if (tab) {
            tab.click();
        }
    }

    // Public API: Get current active tab
    getActive() {
        const activeTab = this.container.querySelector('.tabs-item.active');
        const activeContent = this.container.querySelector('.tabs-content.active');
        return {
            tab: activeTab,
            content: activeContent,
            id: activeTab?.dataset.tab
        };
    }

    // Public API: Destroy instance
    destroy() {
        this.tabs.forEach(tab => {
            tab.removeAttribute('role');
            tab.removeAttribute('aria-selected');
            tab.removeAttribute('tabindex');
            tab.removeAttribute('aria-controls');
        });

        this.contents.forEach(content => {
            content.removeAttribute('role');
            content.removeAttribute('aria-hidden');
        });

        if (this.tabsHeader) {
            this.tabsHeader.removeAttribute('role');
        }

        delete this.container.dataset.tabsInit;
    }
}

/**
 * Initialize all tabs on the page
 * Detection priority:
 * 1. [data-feature="tabs"]      - Primary: auto-populated by volt from CSS config
 * 2. [data-tabs="true"]         - Explicit tabs flag
 * 3. [data-tabs]                - Legacy attribute
 * 4. .antsand-tabs-{variant}    - Dedicated tabs component
 */
function initAllTabs() {
    const selectors = [
        '[data-feature="tabs"]',   // Primary: auto-populated by volt
        '[data-tabs="true"]',      // Explicit flag
        '[data-tabs]',             // Legacy attribute
        '.antsand-tabs',
        '.antsand-tabs-pills',
        '.antsand-tabs-steps',
        '.antsand-tabs-vertical',
        '.antsand-tabs-underline',
        '.antsand-tabs-boxed'
    ].join(', ');

    const containers = document.querySelectorAll(selectors);
    const instances = [];

    containers.forEach(container => {
        if (!container.dataset.tabsInit) {
            instances.push(new AntsandTabs(container));
        }
    });

    return instances;
}

function findTabsContainerFromTab(tab) {
    return tab ? tab.closest('[data-feature="tabs"], [data-tabs], .antsand-tabs, .antsand-tabs-pills, .antsand-tabs-steps, .antsand-tabs-vertical, .antsand-tabs-underline, .antsand-tabs-boxed') : null;
}

function activateTabElement(tab) {
    const container = findTabsContainerFromTab(tab);
    if (!container) return;

    if (container.dataset.tabsInit !== 'true') {
        new AntsandTabs(container);
    }

    const targetId = tab.dataset.tab;
    const tabs = Array.from(container.querySelectorAll('.tabs-item'));
    const contents = Array.from(container.querySelectorAll('.tabs-content'));
    const singlePaneMode = contents.length === 1 && tabs.length > 1;
    const targetContent = singlePaneMode
        ? contents[0]
        : (targetId ? document.getElementById(targetId) : null) || contents[tabs.indexOf(tab)] || contents[0];

    tabs.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
        item.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    if (!singlePaneMode) {
        contents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });
    }

    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.setAttribute('aria-hidden', 'false');
    }
}

document.addEventListener('click', (event) => {
    const tab = event.target.closest('.tabs-item');
    if (!tab) return;

    const container = findTabsContainerFromTab(tab);
    if (!container) return;

    event.preventDefault();
    activateTabElement(tab);
});

// Export for ES6 module usage
export { AntsandTabs, initAllTabs, activateTabElement };
export default AntsandTabs;
