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
                    <button class="antsand-image-lightbox__nav antsand-image-lightbox__next" type="button" aria-label="Next image">&#8250;</button>
                    <div class="antsand-image-lightbox__meta">
                        <p class="antsand-image-lightbox__caption"></p>
                        <span class="antsand-image-lightbox__counter"></span>
                    </div>
                </div>`;
            document.body.appendChild(lightbox);

            lightbox.querySelector('.antsand-image-lightbox__backdrop').addEventListener('click', () => this.close());
            lightbox.querySelector('.antsand-image-lightbox__close').addEventListener('click', () => this.close());
            lightbox.querySelector('.antsand-image-lightbox__prev').addEventListener('click', (event) => {
                event.stopPropagation();
                this.prev();
            });
            lightbox.querySelector('.antsand-image-lightbox__next').addEventListener('click', (event) => {
                event.stopPropagation();
                this.next();
            });
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
            if (event.key === 'Escape') this.close();
            if (event.key === 'ArrowLeft') this.prev();
            if (event.key === 'ArrowRight') this.next();
        });
        this.lightbox.dataset.imageLightboxKeyboard = 'true';
    }

    open(index = 0) {
        this.currentIndex = index;
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

export { AntsandImageLightbox, initAllImageLightboxes };
