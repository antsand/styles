/**
 * ANTSAND App - Main ES6 Module Entry Point
 *
 * This is the main entry point for ANTSAND interactive components.
 * Import this module to enable all interactive functionality.
 *
 * Components:
 * - AntTable: Sortable, searchable, paginated tables
 * - AntCarousel: Touch-enabled carousels (slide, fade, cards, cover)
 * - AntTabs: Accessible tab navigation
 *
 * Usage:
 *   <script type="module" src="/js/antsand-app.js"></script>
 *
 * Components auto-initialize based on data attributes:
 *   - [data-ant-table] - Tables
 *   - [data-carousel] - Carousels
 *   - [data-tabs] - Tabs
 *
 * Manual initialization:
 *   import { AntTable, AntCarousel, AntTabs } from '/js/antsand-app.js';
 *   const table = new AntTable(element, options);
 */

import { AntTable, initAntTables } from './modules/ant-table.module.js';
import { AntCarousel, initAntCarousels } from './modules/ant-carousel.module.js';
import { AntTabs, initAntTabs } from './modules/ant-tabs.module.js';

// =============================================================================
// AUTO-INITIALIZE ALL COMPONENTS
// =============================================================================
function initAllComponents() {
    initAntTables();
    initAntCarousels();
    initAntTabs();

    console.log('[ANTSAND] Components initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllComponents);
} else {
    initAllComponents();
}

// Re-initialize on dynamic content (for AJAX-loaded content)
// Dispatch this event after loading new content: document.dispatchEvent(new Event('antsand:init'))
document.addEventListener('antsand:init', initAllComponents);

// =============================================================================
// EXPORTS
// =============================================================================
export {
    AntTable,
    AntCarousel,
    AntTabs,
    initAntTables,
    initAntCarousels,
    initAntTabs,
    initAllComponents
};

// Also expose on window for non-module usage
window.ANTSAND = {
    AntTable,
    AntCarousel,
    AntTabs,
    init: initAllComponents
};
