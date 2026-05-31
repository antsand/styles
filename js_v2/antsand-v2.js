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
 * - Accordion, dropdown, topnav, modal, alert progressive enhancement
 * - Image Lightbox (click-to-expand blog/article images)
 * - AI Bar (Copy for AI/LLM, View as Markdown)
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
import { AntsandCheckout, initAllCheckouts } from './modules/checkout.js';
import { AntsandAccordion, initAllAccordions } from './modules/accordion.js';
import { AntsandDropdown, initAllDropdowns } from './modules/dropdown.js';
import { AntsandTopnav, initAllTopnavs } from './modules/topnav.js';
import { AntsandModal, initAllModals, openModal, closeModal } from './modules/modal.js';
import { AntsandAlert, initAllAlerts } from './modules/alert.js';
import { AntsandGallery, initAllGalleries } from './modules/gallery.js';
import { AntsandAiBar, initAllAiBars } from './modules/ai-bar.js';
import { AntsandImageLightbox, initAllImageLightboxes } from './modules/image-lightbox.js';
import { AntsandTableFullscreen, initAllTableFullscreen } from './modules/table-fullscreen.js';

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
        carousels: initAllCarousels(),
        checkouts: initAllCheckouts(),
        accordions: initAllAccordions(),
        dropdowns: initAllDropdowns(),
        topnavs: initAllTopnavs(),
        modals: initAllModals(),
        alerts: initAllAlerts(),
        galleries: initAllGalleries(),
        aiBars: initAllAiBars(),
        imageLightboxes: initAllImageLightboxes(),
        tableFullscreen: initAllTableFullscreen()
    };

    // Log initialization summary (development only)
    if (window.ANTSAND_DEBUG) {
        console.log('ANTSAND v2 initialized:', {
            tabs: initialized.tabs.length,
            tables: initialized.tables.length,
            carousels: initialized.carousels.length,
            checkouts: initialized.checkouts.length,
            accordions: initialized.accordions.length,
            dropdowns: initialized.dropdowns.length,
            topnavs: initialized.topnavs.length,
            modals: initialized.modals.length,
            alerts: initialized.alerts.length,
            galleries: initialized.galleries.length,
            aiBars: initialized.aiBars.length,
            imageLightboxes: initialized.imageLightboxes.length,
            tableFullscreen: initialized.tableFullscreen.length
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
    Checkout: AntsandCheckout,
    Accordion: AntsandAccordion,
    Dropdown: AntsandDropdown,
    Topnav: AntsandTopnav,
    Modal: AntsandModal,
    Alert: AntsandAlert,
    Gallery: AntsandGallery,
    AiBar: AntsandAiBar,
    ImageLightbox: AntsandImageLightbox,
    TableFullscreen: AntsandTableFullscreen,

    // Initialization functions
    initTabs: initAllTabs,
    initTables: initAllTables,
    initCarousels: initAllCarousels,
    initCheckouts: initAllCheckouts,
    initAccordions: initAllAccordions,
    initDropdowns: initAllDropdowns,
    initTopnavs: initAllTopnavs,
    initModals: initAllModals,
    initAlerts: initAllAlerts,
    initGalleries: initAllGalleries,
    initAiBars: initAllAiBars,
    initImageLightboxes: initAllImageLightboxes,
    initTableFullscreen: initAllTableFullscreen,
    openModal,
    closeModal,
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
    AntsandCheckout,
    AntsandAccordion,
    AntsandDropdown,
    AntsandTopnav,
    AntsandModal,
    AntsandAlert,
    AntsandGallery,
    AntsandAiBar,
    AntsandImageLightbox,
    AntsandTableFullscreen,
    initAllTabs,
    initAllTables,
    initAllCarousels,
    initAllCheckouts,
    initAllAccordions,
    initAllDropdowns,
    initAllTopnavs,
    initAllModals,
    initAllAlerts,
    initAllGalleries,
    initAllAiBars,
    initAllImageLightboxes,
    initAllTableFullscreen,
    openModal,
    closeModal,
    initAll
};

export default ANTSAND;
