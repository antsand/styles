/**
 * ANTSAND Carousel Module - ES6 Interactive Carousel Component
 *
 * Features:
 * - Slide, fade, cards, cover variants
 * - Touch/swipe support
 * - Keyboard navigation
 * - Autoplay with pause on hover
 *
 * Usage:
 *   <div class="antsand-carousel-slide" data-carousel data-autoplay="true">
 *     <div class="carousel-track" data-track>
 *       <div class="carousel-item active">...</div>
 *     </div>
 *   </div>
 */

export class AntCarousel {
    constructor(element, options = {}) {
        this.container = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        if (!this.container) {
            console.warn('AntCarousel: Container element not found');
            return;
        }

        this.options = {
            autoplay: this.container.dataset.autoplay === 'true',
            interval: parseInt(this.container.dataset.interval) || 5000,
            pauseOnHover: true,
            touch: true,
            keyboard: true,
            wrap: true,
            ...options
        };

        this.state = {
            currentIndex: 0,
            isPlaying: false,
            autoplayTimer: null,
            touchStartX: 0,
            touchEndX: 0,
            isDragging: false
        };

        this.track = this.container.querySelector('[data-track]') ||
                     this.container.querySelector('.carousel-track');
        this.items = this.track ? Array.from(this.track.querySelectorAll('.carousel-item')) : [];
        this.indicators = Array.from(this.container.querySelectorAll('[data-carousel-indicator]'));
        this.prevBtn = this.container.querySelector('[data-carousel-control="prev"]');
        this.nextBtn = this.container.querySelector('[data-carousel-control="next"]');

        if (this.items.length === 0) {
            console.warn('AntCarousel: No carousel items found');
            return;
        }

        this.init();
    }

    init() {
        this.state.currentIndex = this.items.findIndex(item => item.classList.contains('active'));
        if (this.state.currentIndex === -1) {
            this.state.currentIndex = 0;
            this.items[0]?.classList.add('active');
        }

        this.bindControls();
        if (this.options.touch) this.bindTouch();
        if (this.options.keyboard) this.bindKeyboard();

        if (this.options.autoplay) {
            this.startAutoplay();
            if (this.options.pauseOnHover) {
                this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
                this.container.addEventListener('mouseleave', () => this.startAutoplay());
            }
        }

        this.container.dataset.carouselInit = 'true';
        this.updateDisplay();
    }

    bindControls() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => { e.preventDefault(); this.prev(); });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => { e.preventDefault(); this.next(); });
        }
        this.indicators.forEach((indicator) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goTo(parseInt(indicator.dataset.carouselIndicator));
            });
        });
    }

    bindTouch() {
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

        // Mouse drag
        this.container.addEventListener('mousedown', (e) => {
            this.state.touchStartX = e.clientX;
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

        if (Math.abs(diff) > threshold) {
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
                case 'ArrowLeft': e.preventDefault(); this.prev(); break;
                case 'ArrowRight': e.preventDefault(); this.next(); break;
                case 'Home': e.preventDefault(); this.goTo(0); break;
                case 'End': e.preventDefault(); this.goTo(this.items.length - 1); break;
            }
        });
    }

    prev() {
        let newIndex = this.state.currentIndex - 1;
        if (newIndex < 0) newIndex = this.options.wrap ? this.items.length - 1 : 0;
        this.goTo(newIndex);
    }

    next() {
        let newIndex = this.state.currentIndex + 1;
        if (newIndex >= this.items.length) newIndex = this.options.wrap ? 0 : this.items.length - 1;
        this.goTo(newIndex);
    }

    goTo(index) {
        if (index < 0 || index >= this.items.length || index === this.state.currentIndex) return;

        const prevIndex = this.state.currentIndex;
        this.state.currentIndex = index;
        this.updateDisplay(prevIndex);

        this.container.dispatchEvent(new CustomEvent('carousel:change', {
            detail: { currentIndex: index, previousIndex: prevIndex }
        }));
    }

    updateDisplay() {
        const isFadeVariant = this.container.classList.contains('antsand-carousel-fade');
        const isCardsVariant = this.container.classList.contains('antsand-carousel-cards');

        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.state.currentIndex);
        });

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

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.state.currentIndex);
        });

        if (!this.options.wrap) {
            if (this.prevBtn) this.prevBtn.disabled = this.state.currentIndex === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.state.currentIndex === this.items.length - 1;
        }
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

    destroy() {
        this.stopAutoplay();
        delete this.container.dataset.carouselInit;
    }
}

// Auto-init function
export function initAntCarousels() {
    document.querySelectorAll('[data-carousel]:not([data-carousel-init])').forEach(el => {
        new AntCarousel(el);
    });
}

export default AntCarousel;
