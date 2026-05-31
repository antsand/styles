/**
 * ANTSAND Table Fullscreen Module
 *
 * Progressive enhancement for long article/research tables.
 * Targets semantic wrappers such as:
 * <section class="table-container blog-table-scroll">...</section>
 */

class AntsandTableFullscreen {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container || this.container.dataset.tableFullscreenInit === 'true') {
            return;
        }

        this.table = this.container.querySelector('table');
        if (!this.table) {
            return;
        }

        this.isOpen = false;
        this.backdrop = null;
        this.button = null;
        this.handleEscape = this.handleEscape.bind(this);
        this.init();
    }

    init() {
        this.container.dataset.tableFullscreenInit = 'true';
        this.container.classList.add('blog-table-scroll--enhanced');

        const controls = document.createElement('span');
        controls.className = 'blog-table-scroll__controls';

        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.className = 'blog-table-scroll__fullscreen-button';
        this.button.setAttribute('aria-expanded', 'false');
        this.button.textContent = 'Fullscreen table';
        this.button.addEventListener('click', () => this.toggle());

        controls.appendChild(this.button);
        this.container.insertBefore(controls, this.container.firstChild);
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen) return;

        this.backdrop = document.createElement('button');
        this.backdrop.type = 'button';
        this.backdrop.className = 'blog-table-fullscreen-backdrop';
        this.backdrop.setAttribute('aria-label', 'Close fullscreen table');
        this.backdrop.addEventListener('click', () => this.close());
        document.body.appendChild(this.backdrop);

        this.container.classList.add('is-fullscreen');
        document.body.classList.add('blog-table-fullscreen-open');
        this.button.textContent = 'Exit fullscreen';
        this.button.setAttribute('aria-expanded', 'true');
        document.addEventListener('keydown', this.handleEscape);
        this.button.focus();
        this.isOpen = true;
    }

    close() {
        if (!this.isOpen) return;

        this.container.classList.remove('is-fullscreen');
        document.body.classList.remove('blog-table-fullscreen-open');
        this.button.textContent = 'Fullscreen table';
        this.button.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', this.handleEscape);

        if (this.backdrop) {
            this.backdrop.remove();
            this.backdrop = null;
        }

        this.button.focus();
        this.isOpen = false;
    }

    handleEscape(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}

function initAllTableFullscreen() {
    const containers = document.querySelectorAll(
        '.table-container.blog-table-scroll:not([data-table-fullscreen-init]), [data-table-fullscreen]:not([data-table-fullscreen-init])'
    );
    return Array.from(containers).map((container) => new AntsandTableFullscreen(container));
}

export { AntsandTableFullscreen, initAllTableFullscreen };
