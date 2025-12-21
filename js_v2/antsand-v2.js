/**
 * ANTSAND v2 - Main JavaScript Entry Point (ES6)
 *
 * This is the single entry point for all ANTSAND interactive components.
 * Import this file using: <script type="module" src="/js/antsand-v2.js"></script>
 *
 * Features:
 * - Tabs (all variants: pills, steps, vertical, underline, boxed)
 * - Tables (sortable, searchable, pagination)
 * - Carousel (slide, fade, cards, cover variants)
 * - Forms validation (coming soon)
 *
 * ANTSAND Universal Structure:
 * - Parent class controls variant styling
 * - Child classes are consistent across variants
 * - Section > Header > Data > Footer hierarchy
 *
 * @version 2.1.0
 * @author ANTSAND
 */

// =============================================================================
// MODULE IMPORTS
// =============================================================================
import { AntsandTabs, initAllTabs } from './modules/tabs.js';
import { AntsandTable, initAllTables } from './modules/table.js';
import { AntsandCarousel, initAllCarousels } from './modules/carousel.js';

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

/**
 * Initialize all ANTSAND components on the page
 */
function initAll() {
    const initialized = {
        tabs: initAllTabs(),
        tables: initAllTables(),
        carousels: initAllCarousels()
    };

    // Log initialization summary (development only)
    if (window.ANTSAND_DEBUG) {
        console.log('ANTSAND v2 initialized:', {
            tabs: initialized.tabs.length,
            tables: initialized.tables.length,
            carousels: initialized.carousels.length
        });
    }

    return initialized;
}

/**
 * Initialize on DOM ready
 */
function onReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Auto-initialize when DOM is ready
onReady(() => {
    initAll();

    // Re-initialize on dynamic content (for SPAs)
    // Use MutationObserver for efficient DOM watching
    if (window.ANTSAND_WATCH_DOM) {
        const observer = new MutationObserver((mutations) => {
            let shouldReinit = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    shouldReinit = true;
                }
            });
            if (shouldReinit) {
                initAll();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * ANTSAND Global Namespace
 * Exposes components for manual initialization and configuration
 */
const ANTSAND = {
    // Version
    version: '2.1.0',

    // Component Classes
    Tabs: AntsandTabs,
    Table: AntsandTable,
    Carousel: AntsandCarousel,

    // Initialization functions
    initTabs: initAllTabs,
    initTables: initAllTables,
    initCarousels: initAllCarousels,
    initAll: initAll,

    // Configuration
    config: {
        debug: false,
        watchDOM: false
    },

    // Set configuration
    configure(options) {
        if (options.debug !== undefined) {
            window.ANTSAND_DEBUG = options.debug;
            this.config.debug = options.debug;
        }
        if (options.watchDOM !== undefined) {
            window.ANTSAND_WATCH_DOM = options.watchDOM;
            this.config.watchDOM = options.watchDOM;
        }
    }
};

// Expose to window for non-module usage
window.ANTSAND = ANTSAND;

// =============================================================================
// EXPORTS
// =============================================================================
export {
    ANTSAND,
    AntsandTabs,
    AntsandTable,
    AntsandCarousel,
    initAllTabs,
    initAllTables,
    initAllCarousels,
    initAll
};

export default ANTSAND;
