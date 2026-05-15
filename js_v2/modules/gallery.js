/**
 * ANTSAND Gallery Module (ES6)
 *
 * Canonical public markup uses antsand-gallery* classes. Legacy ant-gallery*
 * selectors remain supported so old demos do not break during migration.
 */

const q = {
    grid: '.antsand-gallery__grid, .ant-gallery__grid',
    item: '.antsand-gallery__item, .ant-gallery__item',
    controls: '.antsand-gallery__controls, .ant-gallery__controls',
    search: '.antsand-gallery__search, .ant-gallery__search',
    count: '.antsand-gallery__count, .ant-gallery__count',
    filter: '.antsand-gallery__filter-btn, .ant-gallery__filter-btn'
};

const lb = {
    root: 'antsand-gallery__lightbox',
    backdrop: 'antsand-gallery__lightbox-backdrop',
    content: 'antsand-gallery__lightbox-content',
    img: 'antsand-gallery__lightbox-img',
    close: 'antsand-gallery__lightbox-close',
    prev: 'antsand-gallery__lightbox-prev',
    next: 'antsand-gallery__lightbox-next',
    counter: 'antsand-gallery__lightbox-counter',
    info: 'antsand-gallery__lightbox-info',
    title: 'antsand-gallery__lightbox-title',
    desc: 'antsand-gallery__lightbox-desc',
    thumbs: 'antsand-gallery__lightbox-thumbs',
    thumb: 'antsand-gallery__lightbox-thumb'
};

function debounce(fn, ms = 200) {
    let timer;
    return function run(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

class AntsandGallery {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container || this.container.dataset.galleryInit === 'true') return;

        this.options = {
            searchPlaceholder: 'Search gallery...',
            showThumbs: true,
            enableZoom: true,
            enableKeyboard: true,
            ...options
        };
        this.grid = this.container.querySelector(q.grid);
        if (!this.grid) return;

        this.items = Array.from(this.grid.querySelectorAll(q.item));
        this.visibleItems = this.items.slice();
        this.currentIndex = 0;
        this.activeFilter = 'all';

        this._controls();
        this._filters();
        this._search();
        this._items();
        this._lightbox();
        this._keyboard();
        this._count();
        this.container.dataset.galleryInit = 'true';
    }

    _controls() {
        const controls = this.container.querySelector(q.controls);
        if (!controls) return;

        let search = controls.querySelector(q.search);
        if (!search) {
            search = document.createElement('div');
            search.className = 'antsand-gallery__search';
            search.innerHTML = `<input type="text" placeholder="${this.options.searchPlaceholder}">`;
            controls.insertBefore(search, controls.firstChild);
        }
        this.searchInput = search.querySelector('input');

        let count = controls.querySelector(q.count);
        if (!count) {
            count = document.createElement('span');
            count.className = 'antsand-gallery__count';
            controls.appendChild(count);
        }
        this.countEl = count;
    }

    _count() {
        if (!this.countEl) return;
        this.countEl.textContent = `${this.visibleItems.length} item${this.visibleItems.length === 1 ? '' : 's'}`;
    }

    _filters() {
        const buttons = Array.from(this.container.querySelectorAll(q.filter));
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((item) => item.classList.remove('active'));
                button.classList.add('active');
                this.activeFilter = button.dataset.filter || 'all';
                this._apply();
            });
        });
    }

    _search() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', debounce(() => this._apply()));
        }
    }

    _apply() {
        const query = (this.searchInput?.value || '').toLowerCase().trim();
        this.visibleItems = this.items.filter((item) => {
            if (this.activeFilter !== 'all' && (item.dataset.category || '') !== this.activeFilter) {
                return false;
            }
            if (!query) return true;
            return [
                item.dataset.title || '',
                item.dataset.desc || '',
                item.dataset.category || '',
                item.textContent || ''
            ].join(' ').toLowerCase().includes(query);
        });

        this.items.forEach((item) => {
            const visible = this.visibleItems.includes(item);
            item.style.opacity = visible ? '1' : '0';
            item.style.transform = visible ? 'scale(1)' : 'scale(0.95)';
            setTimeout(() => {
                item.style.display = visible ? '' : 'none';
            }, visible ? 0 : 250);
        });
        this._count();
    }

    _items() {
        this.items.forEach((item) => {
            item.addEventListener('click', (event) => {
                if (event.target.closest('a, button')) return;
                const index = this.visibleItems.indexOf(item);
                if (index >= 0) this.open(index);
            });
        });
    }

    _lightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = lb.root;
        this.lightbox.innerHTML = `
            <div class="${lb.backdrop}"></div>
            <div class="${lb.content}">
                <img class="${lb.img}" src="" alt="">
                <button class="${lb.close}" type="button" aria-label="Close">&times;</button>
                <button class="${lb.prev}" type="button" aria-label="Previous">&#8249;</button>
                <button class="${lb.next}" type="button" aria-label="Next">&#8250;</button>
                <span class="${lb.counter}"></span>
                <div class="${lb.info}"><h4 class="${lb.title}"></h4><p class="${lb.desc}"></p></div>
            </div>
            <div class="${lb.thumbs}"></div>`;

        document.body.appendChild(this.lightbox);
        this.lightbox.querySelector(`.${lb.backdrop}`).addEventListener('click', () => this.close());
        this.lightbox.querySelector(`.${lb.close}`).addEventListener('click', () => this.close());
        this.lightbox.querySelector(`.${lb.prev}`).addEventListener('click', (event) => {
            event.stopPropagation();
            this.prev();
        });
        this.lightbox.querySelector(`.${lb.next}`).addEventListener('click', (event) => {
            event.stopPropagation();
            this.next();
        });
        this.lightbox.querySelector(`.${lb.img}`).addEventListener('click', (event) => {
            if (!this.options.enableZoom) return;
            event.stopPropagation();
            event.currentTarget.classList.toggle('zoomed');
        });
    }

    open(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        this._update();
        this._thumbs();
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.lightbox.querySelector(`.${lb.img}`).classList.remove('zoomed');
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
        this._update();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.visibleItems.length;
        this._update();
    }

    _update() {
        const item = this.visibleItems[this.currentIndex];
        if (!item) return;
        const source = item.querySelector('img');
        const title = item.dataset.title || source?.alt || '';
        const desc = item.dataset.desc || '';
        const image = this.lightbox.querySelector(`.${lb.img}`);

        image.src = item.dataset.full || source?.src || '';
        image.alt = title;
        image.classList.remove('zoomed');
        this.lightbox.querySelector(`.${lb.title}`).textContent = title;
        this.lightbox.querySelector(`.${lb.desc}`).textContent = desc;
        this.lightbox.querySelector(`.${lb.counter}`).textContent = `${this.currentIndex + 1} / ${this.visibleItems.length}`;
        this.lightbox.querySelector(`.${lb.info}`).style.display = title || desc ? '' : 'none';
        this.lightbox.querySelectorAll(`.${lb.thumb}`).forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    _thumbs() {
        if (!this.options.showThumbs) return;
        const thumbs = this.lightbox.querySelector(`.${lb.thumbs}`);
        thumbs.innerHTML = this.visibleItems.map((item, index) => {
            const img = item.querySelector('img');
            return `<div class="${lb.thumb}${index === this.currentIndex ? ' active' : ''}" data-index="${index}"><img src="${img?.src || ''}" alt=""></div>`;
        }).join('');
        thumbs.querySelectorAll(`.${lb.thumb}`).forEach((thumb) => {
            thumb.addEventListener('click', () => {
                this.currentIndex = Number(thumb.dataset.index);
                this._update();
            });
        });
    }

    _keyboard() {
        if (!this.options.enableKeyboard) return;
        document.addEventListener('keydown', (event) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (event.key === 'Escape') this.close();
            if (event.key === 'ArrowLeft') this.prev();
            if (event.key === 'ArrowRight') this.next();
        });
    }
}

function initAllGalleries() {
    const galleries = [];
    document.querySelectorAll('[data-gallery-module], .antsand-gallery, .ant-gallery').forEach((container) => {
        if (container.dataset.galleryInit !== 'true') {
            galleries.push(new AntsandGallery(container));
        }
    });
    return galleries;
}

export { AntsandGallery, initAllGalleries };
