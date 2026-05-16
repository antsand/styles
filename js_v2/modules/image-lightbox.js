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
    '.icon',
    'svg'
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

    const src = getImageSource(img).toLowerCase();
    if (src.endsWith('.svg') || src.startsWith('data:image/svg')) return false;

    const width = img.naturalWidth || img.width || 0;
    const height = img.naturalHeight || img.height || 0;
    if (width && height && (width < 120 || height < 80)) return false;

    return true;
}

class AntsandImageLightbox {
    constructor(root, options = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root) : root;
        if (!this.root || this.root.dataset.imageLightboxInit === 'true') return;

        this.options = {
            enableKeyboard: true,
            ...options
        };

        this.images = Array.from(this.root.querySelectorAll('img')).filter(isContentImage);
        if (this.images.length === 0) return;

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
                    <img class="antsand-image-lightbox__image" src="" alt="">
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
        this.images.forEach((img, index) => {
            img.dataset.imageLightboxBound = 'true';
            img.classList.add('antsand-image-lightbox-trigger');
            img.setAttribute('tabindex', img.getAttribute('tabindex') || '0');
            img.setAttribute('role', img.getAttribute('role') || 'button');
            img.setAttribute('aria-label', img.getAttribute('aria-label') || 'Expand image');

            img.addEventListener('click', (event) => {
                if (event.defaultPrevented) return;
                if (event.target.closest('a') && !img.closest('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".webp"]')) {
                    return;
                }
                event.preventDefault();
                this.open(index);
            });

            img.addEventListener('keydown', (event) => {
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
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this._update();
    }

    next() {
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this._update();
    }

    _update() {
        const img = this.images[this.currentIndex];
        if (!img) return;

        const image = this.lightbox.querySelector('.antsand-image-lightbox__image');
        const caption = this.lightbox.querySelector('.antsand-image-lightbox__caption');
        const counter = this.lightbox.querySelector('.antsand-image-lightbox__counter');
        const prev = this.lightbox.querySelector('.antsand-image-lightbox__prev');
        const next = this.lightbox.querySelector('.antsand-image-lightbox__next');

        const title = img.dataset.caption || img.getAttribute('alt') || img.getAttribute('title') || '';
        image.src = getImageSource(img);
        image.alt = title;
        caption.innerHTML = escapeHtml(title);
        caption.style.display = title ? '' : 'none';
        counter.textContent = this.images.length > 1 ? `${this.currentIndex + 1} / ${this.images.length}` : '';
        prev.style.display = this.images.length > 1 ? '' : 'none';
        next.style.display = this.images.length > 1 ? '' : 'none';
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
