/**
 * ANTSAND Dropdown Module (ES6)
 *
 * Supports Sass v2 dropdown markup:
 * <div class="antsand-dropdown">
 *   <button class="antsand-dropdown-toggle">Menu</button>
 *   <div class="antsand-dropdown-menu">...</div>
 * </div>
 */

class AntsandDropdown {
    constructor(dropdown) {
        this.dropdown = typeof dropdown === 'string'
            ? document.querySelector(dropdown)
            : dropdown;

        if (!this.dropdown || this.dropdown.dataset.dropdownInit === 'true') return;

        this.toggle = this.dropdown.querySelector('.antsand-dropdown-toggle');
        this.menu = this.dropdown.querySelector('.antsand-dropdown-menu');
        if (!this.toggle || !this.menu) return;

        this._init();
        this.dropdown.dataset.dropdownInit = 'true';
    }

    _init() {
        if (!this.toggle.hasAttribute('type') && this.toggle.tagName === 'BUTTON') {
            this.toggle.setAttribute('type', 'button');
        }

        this.toggle.setAttribute('aria-haspopup', 'menu');
        this.toggle.setAttribute('aria-expanded', this.isOpen() ? 'true' : 'false');
        this.menu.setAttribute('role', this.menu.getAttribute('role') || 'menu');

        this.menu.querySelectorAll('.antsand-dropdown-item').forEach(item => {
            if (!item.hasAttribute('role')) {
                item.setAttribute('role', 'menuitem');
            }
        });

        this.toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.toggleOpen();
        });

        this.dropdown.addEventListener('keydown', (event) => this.handleKeydown(event));
    }

    isOpen() {
        return this.menu.classList.contains('active');
    }

    open() {
        closeAllDropdowns(this.dropdown);
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.dropdown.dispatchEvent(new CustomEvent('antsand:dropdown:open', { bubbles: true }));
    }

    close() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.dropdown.dispatchEvent(new CustomEvent('antsand:dropdown:close', { bubbles: true }));
    }

    toggleOpen() {
        this.isOpen() ? this.close() : this.open();
    }

    handleKeydown(event) {
        const items = Array.from(this.menu.querySelectorAll('.antsand-dropdown-item:not(:disabled):not([aria-disabled="true"])'));
        const currentIndex = items.indexOf(document.activeElement);

        if (event.key === 'Escape') {
            this.close();
            this.toggle.focus();
            return;
        }

        if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && document.activeElement === this.toggle) {
            event.preventDefault();
            this.open();
            items[0]?.focus();
            return;
        }

        if (!this.isOpen() || items.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            items[(currentIndex + 1) % items.length]?.focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            items[(currentIndex - 1 + items.length) % items.length]?.focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            items[0]?.focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            items[items.length - 1]?.focus();
        }
    }
}

function closeAllDropdowns(except = null) {
    document.querySelectorAll('.antsand-dropdown').forEach(dropdown => {
        if (except && dropdown === except) return;
        const toggle = dropdown.querySelector('.antsand-dropdown-toggle');
        const menu = dropdown.querySelector('.antsand-dropdown-menu');
        if (!toggle || !menu) return;
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    });
}

function findDropdownFromToggle(toggle) {
    return toggle ? toggle.closest('.antsand-dropdown') : null;
}

function toggleDropdownElement(dropdown) {
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.antsand-dropdown-toggle');
    const menu = dropdown.querySelector('.antsand-dropdown-menu');
    if (!toggle || !menu) return;

    const isOpen = menu.classList.contains('active');
    if (isOpen) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.dispatchEvent(new CustomEvent('antsand:dropdown:close', { bubbles: true }));
        return;
    }

    closeAllDropdowns(dropdown);
    toggle.classList.add('active');
    menu.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.dispatchEvent(new CustomEvent('antsand:dropdown:open', { bubbles: true }));
}

function initAllDropdowns() {
    const instances = [];
    document.querySelectorAll('.antsand-dropdown').forEach(dropdown => {
        if (dropdown.dataset.dropdownInit !== 'true') {
            instances.push(new AntsandDropdown(dropdown));
        }
    });
    return instances;
}

document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.antsand-dropdown-toggle');
    if (toggle) {
        const dropdown = findDropdownFromToggle(toggle);
        if (dropdown && dropdown.dataset.dropdownInit !== 'true') {
            event.preventDefault();
            event.stopPropagation();
            toggleDropdownElement(dropdown);
        }
        return;
    }

    if (!event.target.closest('.antsand-dropdown')) {
        closeAllDropdowns();
    }
});

export { AntsandDropdown, initAllDropdowns, closeAllDropdowns, toggleDropdownElement };
