/**
 * ANTSAND Topnav Module (ES6)
 *
 * Handles mobile hamburger toggle for .antsand-topnav-shell navbars.
 */

class AntsandTopnav {
    constructor(nav) {
        this.nav = typeof nav === 'string' ? document.querySelector(nav) : nav;
        if (!this.nav || this.nav.dataset.topnavInit === 'true') return;

        this.toggle = this.nav.querySelector('.antsand-topnav-toggle, .antsand-navbar-toggle');
        this.menu = this.nav.querySelector('.antsand-topnav-menu, .antsand-navbar-nav, .antsand-nav-items');
        if (!this.toggle || !this.menu) return;

        this._init();
        this.nav.dataset.topnavInit = 'true';
    }

    _init() {
        if (this.toggle.tagName === 'BUTTON' && !this.toggle.hasAttribute('type')) {
            this.toggle.setAttribute('type', 'button');
        }
        this.toggle.setAttribute('aria-expanded', this._isOpen() ? 'true' : 'false');
        this.toggle.setAttribute('aria-controls', this.menu.id || `${this.nav.id || 'antsand-nav'}-menu`);
        this.menu.id = this.menu.id || this.toggle.getAttribute('aria-controls');

        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggle();
        });

        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this._close());
        });

        document.addEventListener('click', (e) => {
            if (this._isOpen() && !this.nav.contains(e.target)) {
                this._close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._isOpen()) {
                this._close();
                this.toggle.focus();
            }
        });
    }

    _toggle() {
        this._isOpen() ? this._close() : this._open();
    }

    _isOpen() {
        return this.menu.classList.contains('active') || this.menu.classList.contains('nav-open');
    }

    _open() {
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.menu.classList.add('nav-open');
        this.toggle.querySelector('.antsand-navbar-toggle-icon')?.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
    }

    _close() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.menu.classList.remove('nav-open');
        this.toggle.querySelector('.antsand-navbar-toggle-icon')?.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

function initAllTopnavs() {
    const instances = [];
    document.querySelectorAll('.antsand-topnav-shell, .antsand-navbar').forEach(nav => {
        if (nav.dataset.topnavInit !== 'true') {
            instances.push(new AntsandTopnav(nav));
        }
    });
    return instances;
}

export { AntsandTopnav, initAllTopnavs };
