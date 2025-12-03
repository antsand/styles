/**
 * ANTSAND Tabs Component
 * Lightweight, accessible tab functionality
 *
 * Usage:
 * <div class="antsand-tabs-pills" data-antsand-tabs>
 *   <button class="antsand-tab-pill active" data-tab="tab1">Tab 1</button>
 *   <button class="antsand-tab-pill" data-tab="tab2">Tab 2</button>
 * </div>
 * <div class="antsand-tab-content active" id="tab1">Content 1</div>
 * <div class="antsand-tab-content" id="tab2">Content 2</div>
 */

(function() {
    'use strict';

    /**
     * Initialize a single tab group
     * @param {HTMLElement} container - The container element with data-antsand-tabs
     */
    function initTabGroup(container) {
        const tabs = container.querySelectorAll('[data-tab]');

        if (tabs.length === 0) {
            console.warn('No tabs found in container', container);
            return;
        }

        // Get the parent container that holds both tabs and content
        const parentContainer = container.closest('[data-antsand-tabs-group]') || container.parentElement;

        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('data-tab');

                // Deactivate all tabs in this group
                tabs.forEach(t => t.classList.remove('active'));

                // Activate clicked tab
                this.classList.add('active');

                // Deactivate all content panes
                const allContent = parentContainer.querySelectorAll('.antsand-tab-content');
                allContent.forEach(pane => pane.classList.remove('active'));

                // Activate target content
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');

                    // Trigger custom event
                    const event = new CustomEvent('antsand:tab:changed', {
                        detail: { tabId: targetId, tab: this, content: targetContent }
                    });
                    container.dispatchEvent(event);
                } else {
                    console.warn(`Tab content not found: #${targetId}`);
                }
            });

            // Keyboard navigation
            tab.addEventListener('keydown', function(e) {
                let newTab = null;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    newTab = getNextTab(tabs, Array.from(tabs).indexOf(this));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    newTab = getPrevTab(tabs, Array.from(tabs).indexOf(this));
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    newTab = tabs[0];
                } else if (e.key === 'End') {
                    e.preventDefault();
                    newTab = tabs[tabs.length - 1];
                }

                if (newTab) {
                    newTab.focus();
                    newTab.click();
                }
            });
        });

        // Set ARIA attributes for accessibility
        tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
        });

        container.setAttribute('role', 'tablist');
    }

    /**
     * Get next tab in sequence
     */
    function getNextTab(tabs, currentIndex) {
        return tabs[(currentIndex + 1) % tabs.length];
    }

    /**
     * Get previous tab in sequence
     */
    function getPrevTab(tabs, currentIndex) {
        return tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    }

    /**
     * Initialize all tab groups on the page
     */
    function init() {
        const tabContainers = document.querySelectorAll('[data-antsand-tabs], .antsand-tabs-pills, .antsand-tabs-steps, .antsand-tabs-vertical, .antsand-tabs-underline, .antsand-tabs-boxed');

        tabContainers.forEach(container => {
            initTabGroup(container);
        });
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for manual initialization
    window.antsandTabs = {
        init: init,
        initTabGroup: initTabGroup
    };

})();
