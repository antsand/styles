/**
 * ANTSAND Carousel Module (ES6)
 *
 * Follows ANTSAND Universal Structure:
 * - Parent class controls variant styling (antsand-carousel-slide, antsand-carousel-fade, etc.)
 * - Child classes are consistent: .carousel-track, .carousel-item, .carousel-controls
 *
 * =====================================================================
 * UNIVERSAL CAROUSEL ACTIVATION
 * =====================================================================
 * Any template can enable carousel mode by adding class: feature-carousel-{index}
 * Example: class="data-container feature-carousel-1"
 *
 * Structure for universal carousel (simpler):
 * <div class="data-container feature-carousel-1" data-carousel>
 *   <div class="data-track" data-track>
 *     <div class="data-sub-container">...</div>   <!-- slide 1 -->
 *     <div class="data-sub-container">...</div>   <!-- slide 2 -->
 *   </div>
 *   <div class="carousel-controls">
 *     <button data-carousel-control="prev">‹</button>
 *     <button data-carousel-control="next">›</button>
 *   </div>
 *   <div class="carousel-indicators">...</div>
 * </div>
 *
 * =====================================================================
 * DEDICATED CAROUSEL COMPONENT
 * =====================================================================
 * HTML Structure (consistent across all variants):
 * <div class="antsand-carousel-{variant}" data-carousel data-autoplay="true" data-interval="5000">
 *   <div class="carousel-body">
 *     <div class="carousel-track-wrapper">
 *       <div class="carousel-track" data-track>
 *         <div class="carousel-item active">...</div>
 *         <div class="carousel-item">...</div>
 *       </div>
 *     </div>
 *   </div>
 *   <div class="carousel-footer">
 *     <div class="carousel-controls">
 *       <button data-carousel-control="prev">‹</button>
 *       <button data-carousel-control="next">›</button>
 *     </div>
 *     <div class="carousel-indicators">
 *       <button data-carousel-indicator="0" class="active"></button>
 *       <button data-carousel-indicator="1"></button>
 *     </div>
 *   </div>
 * </div>
 *
 * Variants (parent class only changes):
 * - antsand-carousel-slide  : Classic horizontal sliding
 * - antsand-carousel-fade   : Crossfade transitions
 * - antsand-carousel-cards  : Multiple visible cards
 * - antsand-carousel-cover  : Full-screen hero style
 * - feature-carousel-{n}    : Universal carousel on any template
 */

class AntsandCarousel {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.warn('AntsandCarousel: Container not found');
            return;
        }

        // Check if already initialized
        if (this.container.dataset.carouselInit === 'true') {
            return;
        }

        // Parse options from data attributes
        // All options can be controlled via data-carousel-* attributes
        // Example: data-carousel-wrap="false" data-carousel-autoplay="true" data-carousel-interval="3000"
        this.options = {
            autoplay: this.container.dataset.carouselAutoplay === 'true',
            interval: parseInt(this.container.dataset.carouselInterval) || 5000,
            pauseOnHover: this.container.dataset.carouselPauseOnHover !== 'false', // default true
            touch: this.container.dataset.carouselTouch !== 'false', // default true
            keyboard: this.container.dataset.carouselKeyboard !== 'false', // default true
            wrap: this.container.dataset.carouselWrap !== 'false' // default true (loops around)
        };

        // State
        this.state = {
            currentIndex: 0,
            isPlaying: false,
            autoplayTimer: null,
            touchStartX: 0,
            touchEndX: 0,
            isDragging: false
        };

        // Detect if this is a universal carousel
        // Check for: data-feature="carousel" (preferred) OR feature-carousel-* class (legacy)
        this.isUniversalCarousel = this.container.dataset.feature === 'carousel' ||
                                   this.container.dataset.carousel === 'true' ||
                                   /feature-carousel-\d+/.test(this.container.className);

        // Get variant from data-carousel-variant attribute if set
        this.variant = this.container.dataset.carouselVariant || '';

        // Get section index for debugging/targeting
        this.sectionIndex = this.container.dataset.sectionIndex || null;

        // DOM elements
        this.track = this.container.querySelector('[data-track]') ||
                     this.container.querySelector('.carousel-track') ||
                     this.container.querySelector('.data-track');

        // For universal carousel, items are .data-sub-container; for dedicated, .carousel-item
        if (this.track) {
            this.items = Array.from(this.track.querySelectorAll('.carousel-item'));
            if (this.items.length === 0) {
                // Fallback to data-sub-container for universal carousel
                this.items = Array.from(this.track.children);
            }
        } else {
            this.items = [];
        }

        this.indicators = Array.from(this.container.querySelectorAll('[data-carousel-indicator]'));
        this.prevBtn = this.container.querySelector('[data-carousel-control="prev"]');
        this.nextBtn = this.container.querySelector('[data-carousel-control="next"]');

        if (this.items.length === 0) {
            console.warn('AntsandCarousel: No carousel items found in container');
            return;
        }

        // Add carousel-item class to items for consistent styling (universal carousel)
        if (this.isUniversalCarousel) {
            this.items.forEach(item => item.classList.add('carousel-item'));
        }

        this.init();
    }

    init() {
        // Find active item or default to first
        this.state.currentIndex = this.items.findIndex(item => item.classList.contains('active'));
        if (this.state.currentIndex === -1) {
            this.state.currentIndex = 0;
            this.items[0]?.classList.add('active');
        }

        // Bind events
        this.bindControls();
        if (this.options.touch) this.bindTouch();
        if (this.options.keyboard) this.bindKeyboard();

        // Autoplay
        if (this.options.autoplay) {
            this.startAutoplay();
            if (this.options.pauseOnHover) {
                this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
                this.container.addEventListener('mouseleave', () => this.startAutoplay());
            }
        }

        // Set ARIA attributes
        this.setAccessibility();

        // Mark as initialized
        this.container.dataset.carouselInit = 'true';
        this.updateDisplay();
    }

    bindControls() {
        // For universal carousels, controls may be siblings (outside the container)
        // Try to find them within container first, then look at siblings
        if (!this.prevBtn) {
            this.prevBtn = this.container.parentElement?.querySelector('[data-carousel-control="prev"]');
        }
        if (!this.nextBtn) {
            this.nextBtn = this.container.parentElement?.querySelector('[data-carousel-control="next"]');
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.prev();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.next();
            });
        }
        this.indicators.forEach((indicator) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goTo(parseInt(indicator.dataset.carouselIndicator));
            });
        });
    }

    bindTouch() {
        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.state.touchStartX = e.touches[0].clientX;
            this.state.isDragging = true;
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!this.state.isDragging) return;
            this.state.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            if (!this.state.isDragging) return;
            this.state.isDragging = false;
            this.handleSwipe();
        });

        // Mouse drag - but not on control buttons
        this.container.addEventListener('mousedown', (e) => {
            // Don't initiate drag on control buttons or indicators
            if (e.target.closest('[data-carousel-control]') || e.target.closest('.carousel-indicator')) {
                return;
            }
            this.state.touchStartX = e.clientX;
            this.state.touchEndX = e.clientX; // Initialize to same position
            this.state.isDragging = true;
            this.container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.state.isDragging) return;
            this.state.touchEndX = e.clientX;
        });

        document.addEventListener('mouseup', () => {
            if (!this.state.isDragging) return;
            this.state.isDragging = false;
            this.container.style.cursor = '';
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const diff = this.state.touchStartX - this.state.touchEndX;
        const threshold = 50;

        // Only swipe if there was actual movement
        if (this.state.touchStartX !== 0 && this.state.touchEndX !== 0 && Math.abs(diff) > threshold) {
            if (diff > 0) this.next();
            else this.prev();
        }

        this.state.touchStartX = 0;
        this.state.touchEndX = 0;
    }

    bindKeyboard() {
        this.container.setAttribute('tabindex', '0');
        this.container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goTo(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goTo(this.items.length - 1);
                    break;
            }
        });
    }

    prev() {
        let newIndex = this.state.currentIndex - 1;
        if (newIndex < 0) {
            newIndex = this.options.wrap ? this.items.length - 1 : 0;
        }
        this.goTo(newIndex);
    }

    next() {
        let newIndex = this.state.currentIndex + 1;
        if (newIndex >= this.items.length) {
            newIndex = this.options.wrap ? 0 : this.items.length - 1;
        }
        this.goTo(newIndex);
    }

    goTo(index) {
        if (index < 0 || index >= this.items.length || index === this.state.currentIndex) {
            return;
        }

        const prevIndex = this.state.currentIndex;
        this.state.currentIndex = index;
        this.updateDisplay();

        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('antsand:carousel:changed', {
            detail: {
                currentIndex: index,
                previousIndex: prevIndex,
                item: this.items[index]
            },
            bubbles: true
        }));
    }

    updateDisplay() {
        const isFadeVariant = this.container.classList.contains('antsand-carousel-fade');
        const isCardsVariant = this.container.classList.contains('antsand-carousel-cards');

        // Update items
        this.items.forEach((item, index) => {
            const isActive = index === this.state.currentIndex;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-hidden', !isActive);
        });

        // Update track transform (for slide/cards variants)
        if (!isFadeVariant && this.track) {
            if (isCardsVariant) {
                const itemWidth = this.items[0]?.offsetWidth || 0;
                const gap = 16;
                const offset = this.state.currentIndex * (itemWidth + gap);
                this.track.style.transform = `translateX(-${offset}px)`;
            } else {
                const offset = this.state.currentIndex * 100;
                this.track.style.transform = `translateX(-${offset}%)`;
            }
        }

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.state.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });

        // Update controls disabled state (when wrap is false)
        if (!this.options.wrap) {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.state.currentIndex === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.state.currentIndex === this.items.length - 1;
            }
        }
    }

    setAccessibility() {
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-roledescription', 'carousel');

        this.items.forEach((item, index) => {
            item.setAttribute('role', 'group');
            item.setAttribute('aria-roledescription', 'slide');
            item.setAttribute('aria-label', `Slide ${index + 1} of ${this.items.length}`);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });
    }

    startAutoplay() {
        if (this.state.isPlaying) return;
        this.state.isPlaying = true;
        this.state.autoplayTimer = setInterval(() => this.next(), this.options.interval);
    }

    pauseAutoplay() {
        this.state.isPlaying = false;
        if (this.state.autoplayTimer) {
            clearInterval(this.state.autoplayTimer);
            this.state.autoplayTimer = null;
        }
    }

    stopAutoplay() {
        this.pauseAutoplay();
        this.options.autoplay = false;
    }

    // Public API: Get current slide
    getCurrent() {
        return {
            index: this.state.currentIndex,
            item: this.items[this.state.currentIndex]
        };
    }

    // Public API: Destroy instance
    destroy() {
        this.stopAutoplay();
        delete this.container.dataset.carouselInit;
    }
}

/**
 * Initialize all carousels on the page
 * Detection priority:
 * 1. [data-feature="carousel"]     - Primary: auto-populated by volt from CSS config
 * 2. [data-carousel="true"]        - Explicit carousel flag
 * 3. [data-carousel]               - Legacy attribute
 * 4. .antsand-carousel-{variant}   - Dedicated carousel component
 * 5. .feature-carousel-{n}         - Legacy class pattern
 */
function initAllCarousels() {
    // Standard selectors (priority order)
    const standardSelectors = [
        '[data-feature="carousel"]',  // Primary: auto-populated by volt
        '[data-carousel="true"]',     // Explicit flag
        '[data-carousel]',            // Legacy attribute
        '.antsand-carousel-slide',
        '.antsand-carousel-fade',
        '.antsand-carousel-cards',
        '.antsand-carousel-cover'
    ];

    const containers = new Set();

    // Add containers matching standard selectors
    document.querySelectorAll(standardSelectors.join(', ')).forEach(el => containers.add(el));

    // Find all elements with feature-carousel-* class pattern (legacy support)
    document.querySelectorAll('[class*="feature-carousel-"]').forEach(el => {
        if (/feature-carousel-\d+/.test(el.className)) {
            containers.add(el);
        }
    });

    const instances = [];

    containers.forEach(container => {
        if (!container.dataset.carouselInit) {
            instances.push(new AntsandCarousel(container));
        }
    });

    return instances;
}

// Export for ES6 module usage
export { AntsandCarousel, initAllCarousels };
export default AntsandCarousel;
