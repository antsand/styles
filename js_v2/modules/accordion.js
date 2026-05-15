/**
 * ANTSAND Accordion Module (ES6)
 */

class AntsandAccordion {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container || this.container.dataset.accordionInit === 'true') return;

        this.allowMultiple = this.container.hasAttribute('data-accordion-multiple');
        this.items = [];

        this._init();
        this.container.dataset.accordionInit = 'true';
    }

    _init() {
        const headers = this.container.querySelectorAll('.antsand-accordion-header');
        headers.forEach(header => {
            const item = header.closest('.antsand-accordion-item') || header.parentElement;
            const body = item.querySelector('.antsand-accordion-body');
            if (!body) return;

            this.items.push({ header, body, item });

            const isActive = body.classList.contains('active');
            header.classList.toggle('active', isActive);
            header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            body.style.overflow = 'hidden';
            body.style.maxHeight = isActive ? body.scrollHeight + 'px' : '0';

            header.addEventListener('click', (event) => {
                event.preventDefault();
                this._toggle(header, body);
            });

            header.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this._toggle(header, body);
                }
            });
        });

        if (this.container.hasAttribute('data-accordion-all-open')) {
            this.items.forEach(({ header, body }) => this._open(header, body));
        }
    }

    _toggle(header, body) {
        if (body.classList.contains('active')) {
            this._close(header, body);
            return;
        }

        if (!this.allowMultiple) {
            this.items.forEach(({ header: itemHeader, body: itemBody }) => {
                if (itemBody !== body && itemBody.classList.contains('active')) {
                    this._close(itemHeader, itemBody);
                }
            });
        }

        this._open(header, body);
    }

    _open(header, body) {
        body.classList.add('active');
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
    }

    _close(header, body) {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.offsetHeight; // Force reflow before transition.
        body.classList.remove('active');
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0';
    }

    openAll() {
        this.items.forEach(({ header, body }) => this._open(header, body));
    }

    closeAll() {
        this.items.forEach(({ header, body }) => this._close(header, body));
    }

    toggle(index) {
        if (this.items[index]) {
            const { header, body } = this.items[index];
            this._toggle(header, body);
        }
    }
}

function initAllAccordions() {
    const instances = [];
    const selectors = '[data-accordion], .antsand-accordion';
    document.querySelectorAll(selectors).forEach(container => {
        if (container.dataset.accordionInit !== 'true') {
            instances.push(new AntsandAccordion(container));
        }
    });
    return instances;
}

export { AntsandAccordion, initAllAccordions };
