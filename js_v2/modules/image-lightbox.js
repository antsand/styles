/**
 * ANTSAND Image Lightbox Module (ES6)
 *
 * Progressive enhancement for generated blog/article pages.
 * Auto-detects content images inside article roots and supports explicit opt-in:
 *
 * <article class="antsand-article">...</article>
 * <div data-image-lightbox>...</div>
 *
 * Per-image opt-out:
 * <img data-no-lightbox src="..." alt="">
 * <svg data-no-lightbox>...</svg>
 */

const ROOT_SELECTOR = [
    '[data-image-lightbox]',
    '.antsand-article',
    '.blog-article-layout',
    '.blog-research-layout',
    '.blog-video-layout',
    '.post-detail',
    '.post-detail-content',
    '.blog-post-content',
    '.article-content'
].join(', ');

const SKIP_SELECTOR = [
    '[data-no-lightbox]',
    '.no-lightbox',
    '.antsand-logo',
    '.footer-logo',
    '.avatar',
    '.profile-avatar',
    '.icon'
].join(', ');

const SVG_SELECTOR = [
    'figure.article-figure > svg',
    '.article-figure > svg',
    '[data-svg-lightbox]',
    'svg[data-lightbox]'
].join(', ');

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getImageSource(img) {
    return img.dataset.full ||
        img.dataset.fullSrc ||
        img.currentSrc ||
        img.src ||
        '';
}

function isContentImage(img) {
    if (!img || img.dataset.imageLightboxBound === 'true') return false;
    if (img.closest(SKIP_SELECTOR)) return false;
    if (!getImageSource(img)) return false;

    const width = img.naturalWidth || img.width || 0;
    const height = img.naturalHeight || img.height || 0;
    if (width && height && (width < 120 || height < 80)) return false;

    return true;
}

function getSvgCaption(svg) {
    const figure = svg.closest('figure');
    const figcaption = figure?.querySelector('figcaption');
    return svg.dataset.caption ||
        svg.getAttribute('aria-label') ||
        svg.querySelector('title')?.textContent ||
        figcaption?.textContent ||
        '';
}

function isContentSvg(svg) {
    if (!svg || svg.dataset.imageLightboxBound === 'true') return false;
    if (svg.closest(SKIP_SELECTOR)) return false;
    if (!svg.matches(SVG_SELECTOR)) return false;
    if (!svg.getAttribute('viewBox')) return false;
    return true;
}

function createLightboxItem(element, type) {
    return {
        element,
        type,
        getCaption() {
            if (type === 'svg') return getSvgCaption(element);
            return element.dataset.caption || element.getAttribute('alt') || element.getAttribute('title') || '';
        }
    };
}

function clampPan(value, scale, contentSize, viewportSize) {
    const limit = Math.max(0, (contentSize * scale - viewportSize) / 2);
    return Math.max(-limit, Math.min(limit, value));
}

function zoomAroundPoint(state, nextScale, pointX, pointY) {
    const ratio = nextScale / state.zoom;
    return {
        zoom: nextScale,
        panX: pointX - ratio * (pointX - state.panX),
        panY: pointY - ratio * (pointY - state.panY)
    };
}

class AntsandImageLightbox {
    constructor(root, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        if (!this.root || this.root.dataset.imageLightboxInit === 'true') return;

        this.options = {
            enableKeyboard: true,
            ...options
        };

        const imageItems = Array.from(this.root.querySelectorAll('img'))
            .filter(isContentImage)
            .map((img) => createLightboxItem(img, 'image'));
        const svgItems = Array.from(this.root.querySelectorAll(SVG_SELECTOR))
            .filter(isContentSvg)
            .map((svg) => createLightboxItem(svg, 'svg'));

        this.items = [...imageItems, ...svgItems].sort((a, b) => {
            const position = a.element.compareDocumentPosition(b.element);
            return position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
        });
        this.images = this.items.map((item) => item.element); // Backward-compatible public property.
        if (this.items.length === 0) return;

        this.currentIndex = 0;
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this._ensureLightbox();
        this._bindImages();
        this._bindKeyboard();
        this.root.dataset.imageLightboxInit = 'true';
    }

    _ensureLightbox() {
        let lightbox = document.querySelector('.antsand-image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'antsand-image-lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.innerHTML = `
                <button class="antsand-image-lightbox__backdrop" type="button" aria-label="Close image preview"></button>
                <div class="antsand-image-lightbox__dialog">
                    <button class="antsand-image-lightbox__close" type="button" aria-label="Close image preview">&times;</button>
                    <button class="antsand-image-lightbox__nav antsand-image-lightbox__prev" type="button" aria-label="Previous image">&#8249;</button>
                    <div class="antsand-image-lightbox__stage">
                        <img class="antsand-image-lightbox__image" src="" alt="">
                        <div class="antsand-image-lightbox__svg" aria-hidden="true"></div>
                    </div>
                    <div class="antsand-image-lightbox__tools" aria-label="Image zoom controls">
                        <button type="button" data-zoom="out" aria-label="Zoom out">&minus;</button>
                        <span class="antsand-image-lightbox__zoom-level" aria-live="polite">100%</span>
                        <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
                        <button type="button" data-zoom="reset" aria-label="Reset zoom">Fit</button>
                    </div>
                    <button class="antsand-image-lightbox__nav antsand-image-lightbox__next" type="button" aria-label="Next image">&#8250;</button>
                    <div class="antsand-image-lightbox__meta">
                        <p class="antsand-image-lightbox__caption"></p>
                        <span class="antsand-image-lightbox__counter"></span>
                    </div>
                </div>`;
            document.body.appendChild(lightbox);

            const active = () => lightbox.__antsandImageLightbox;
            lightbox.querySelector('.antsand-image-lightbox__backdrop').addEventListener('click', () => active()?.close());
            lightbox.querySelector('.antsand-image-lightbox__close').addEventListener('click', () => active()?.close());
            lightbox.querySelector('.antsand-image-lightbox__prev').addEventListener('click', (event) => {
                event.stopPropagation();
                active()?.prev();
            });
            lightbox.querySelector('.antsand-image-lightbox__next').addEventListener('click', (event) => {
                event.stopPropagation();
                active()?.next();
            });
            lightbox.querySelector('.antsand-image-lightbox__tools').addEventListener('click', (event) => {
                const viewer = active();
                if (!viewer) return;
                const action = event.target.closest('button[data-zoom]')?.dataset.zoom;
                if (action === 'in') viewer.setZoom(viewer.zoom * 1.25);
                if (action === 'out') viewer.setZoom(viewer.zoom / 1.25);
                if (action === 'reset') viewer.setZoom(1);
            });
            const stage = lightbox.querySelector('.antsand-image-lightbox__stage');
            stage.addEventListener('wheel', (event) => {
                const viewer = active();
                if (!viewer || !lightbox.classList.contains('active')) return;
                event.preventDefault();
                const bounds = stage.getBoundingClientRect();
                const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1);
                viewer.setZoom(viewer.zoom * Math.exp(-Math.max(-240, Math.min(240, delta)) * 0.0015), {
                    x: event.clientX - bounds.left - bounds.width / 2,
                    y: event.clientY - bounds.top - bounds.height / 2
                });
            }, { passive: false });
            let drag = null;
            stage.addEventListener('pointerdown', (event) => {
                const viewer = active();
                if (!viewer || viewer.zoom <= 1 || event.button !== 0) return;
                drag = { x: event.clientX, y: event.clientY, panX: viewer.panX, panY: viewer.panY, pointerId: event.pointerId };
                stage.setPointerCapture(event.pointerId);
                event.preventDefault();
            });
            stage.addEventListener('pointermove', (event) => {
                if (!drag || drag.pointerId !== event.pointerId) return;
                const viewer = active();
                if (!viewer) return;
                viewer.panX = drag.panX + event.clientX - drag.x;
                viewer.panY = drag.panY + event.clientY - drag.y;
                viewer._renderTransform();
            });
            stage.addEventListener('pointerup', () => { drag = null; });
            stage.addEventListener('pointercancel', () => { drag = null; });
        }
        this.lightbox = lightbox;
    }

    _bindImages() {
        this.items.forEach((item, index) => {
            const element = item.element;
            element.dataset.imageLightboxBound = 'true';
            element.classList.add('antsand-image-lightbox-trigger');
            element.setAttribute('tabindex', element.getAttribute('tabindex') || '0');
            element.setAttribute('role', element.getAttribute('role') || 'button');
            element.setAttribute('aria-label', element.getAttribute('aria-label') || 'Expand image');

            element.addEventListener('click', (event) => {
                if (event.defaultPrevented) return;
                if (event.target.closest('a') && !element.closest('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"], a[href$=".svg"]')) {
                    return;
                }
                event.preventDefault();
                this.open(index);
            });

            element.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                this.open(index);
            });
        });
    }

    _bindKeyboard() {
        if (!this.options.enableKeyboard || this.lightbox.dataset.imageLightboxKeyboard === 'true') return;
        document.addEventListener('keydown', (event) => {
            if (!this.lightbox.classList.contains('active')) return;
            const viewer = this.lightbox.__antsandImageLightbox;
            if (!viewer) return;
            if (event.key === 'Escape') viewer.close();
            if (event.key === 'ArrowLeft') viewer.prev();
            if (event.key === 'ArrowRight') viewer.next();
            if (event.key === '+' || event.key === '=') viewer.setZoom(viewer.zoom * 1.25);
            if (event.key === '-') viewer.setZoom(viewer.zoom / 1.25);
            if (event.key === '0') viewer.setZoom(1);
        });
        this.lightbox.dataset.imageLightboxKeyboard = 'true';
    }

    open(index = 0) {
        this.currentIndex = index;
        this.lightbox.__antsandImageLightbox = this;
        this._update();
        this.lightbox.classList.add('active');
        this.lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('antsand-image-lightbox-open');
        this.lightbox.querySelector('.antsand-image-lightbox__close')?.focus();
    }

    close() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove('active');
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('antsand-image-lightbox-open');
        this.images[this.currentIndex]?.focus?.();
    }

    prev() {
        if (this.items.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this._update();
    }

    next() {
        if (this.items.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this._update();
    }

    _media() {
        const image = this.lightbox.querySelector('.antsand-image-lightbox__image');
        return image.style.display === 'none'
            ? this.lightbox.querySelector('.antsand-image-lightbox__svg-clone')
            : image;
    }

    _renderTransform() {
        const stage = this.lightbox.querySelector('.antsand-image-lightbox__stage');
        const media = this._media();
        if (media) {
            this.panX = clampPan(this.panX, this.zoom, media.offsetWidth, stage.clientWidth);
            this.panY = clampPan(this.panY, this.zoom, media.offsetHeight, stage.clientHeight);
            media.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`;
        }
        stage.classList.toggle('is-zoomed', this.zoom > 1);
        this.lightbox.querySelector('.antsand-image-lightbox__zoom-level').textContent =
            this.zoom > 1 ? `${Math.round(this.zoom * 100)}%` : 'Fit';
    }

    setZoom(value, point = { x: 0, y: 0 }) {
        const nextZoom = Math.min(8, Math.max(1, value));
        const state = zoomAroundPoint(this, nextZoom, point.x, point.y);
        this.zoom = state.zoom;
        this.panX = nextZoom === 1 ? 0 : state.panX;
        this.panY = nextZoom === 1 ? 0 : state.panY;
        this._renderTransform();
    }

    _update() {
        const item = this.items[this.currentIndex];
        if (!item) return;
        const element = item.element;

        const image = this.lightbox.querySelector('.antsand-image-lightbox__image');
        const svgStage = this.lightbox.querySelector('.antsand-image-lightbox__svg');
        const caption = this.lightbox.querySelector('.antsand-image-lightbox__caption');
        const counter = this.lightbox.querySelector('.antsand-image-lightbox__counter');
        const prev = this.lightbox.querySelector('.antsand-image-lightbox__prev');
        const next = this.lightbox.querySelector('.antsand-image-lightbox__next');

        const title = item.getCaption();
        svgStage.innerHTML = '';

        if (item.type === 'svg') {
            const clone = element.cloneNode(true);
            clone.removeAttribute('id');
            clone.removeAttribute('tabindex');
            clone.removeAttribute('role');
            clone.classList.remove('antsand-image-lightbox-trigger');
            clone.classList.add('antsand-image-lightbox__svg-clone');
            image.removeAttribute('src');
            image.alt = '';
            image.style.display = 'none';
            svgStage.style.display = '';
            svgStage.setAttribute('aria-hidden', 'false');
            svgStage.appendChild(clone);
        } else {
            image.src = getImageSource(element);
            image.alt = title;
            image.style.display = '';
            svgStage.style.display = 'none';
            svgStage.setAttribute('aria-hidden', 'true');
        }

        caption.innerHTML = escapeHtml(title);
        caption.style.display = title ? '' : 'none';
        counter.textContent = this.items.length > 1 ? `${this.currentIndex + 1} / ${this.items.length}` : '';
        prev.style.display = this.items.length > 1 ? '' : 'none';
        next.style.display = this.items.length > 1 ? '' : 'none';
        this.setZoom(1);
    }
}

function initAllImageLightboxes() {
    const instances = [];
    document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
        if (root.dataset.imageLightboxInit !== 'true') {
            const instance = new AntsandImageLightbox(root);
            if (instance.images && instance.images.length > 0) {
                root.__antsandImageLightbox = instance;
                instances.push(instance);
            }
        }
    });
    return instances;
}

export { AntsandImageLightbox, initAllImageLightboxes, clampPan, zoomAroundPoint };
