/**
 * ANTSAND Modal Module (ES6)
 *
 * Supports Sass v2 modal markup:
 * <button data-modal-target="#example">Open</button>
 * <div id="example" class="antsand-modal">
 *   <div class="antsand-modal-dialog">...</div>
 * </div>
 */

const OPEN_SELECTORS = [
    '[data-modal-target]',
    '[data-modal-open]',
    '[data-antsand-modal-target]'
].join(', ');

class AntsandModal {
    constructor(modal) {
        this.modal = typeof modal === 'string'
            ? document.querySelector(modal)
            : modal;

        if (!this.modal || this.modal.dataset.modalInit === 'true') return;

        this.dialog = this.modal.querySelector('.antsand-modal-dialog') || this.modal.firstElementChild;
        this.closeButtons = this.modal.querySelectorAll('.antsand-modal-close, [data-modal-close]');
        this.staticBackdrop = this.modal.hasAttribute('data-modal-static');

        this._init();
        this.modal.dataset.modalInit = 'true';
    }

    _init() {
        this.modal.setAttribute('role', this.modal.getAttribute('role') || 'dialog');
        this.modal.setAttribute('aria-modal', 'true');
        this._syncHiddenState();

        this.closeButtons.forEach(button => {
            if (button.tagName === 'BUTTON' && !button.hasAttribute('type')) {
                button.setAttribute('type', 'button');
            }
            if (!button.hasAttribute('aria-label')) {
                button.setAttribute('aria-label', 'Close modal');
            }
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.close();
            });
        });

        this.modal.addEventListener('click', (event) => {
            if (!this.staticBackdrop && event.target === this.modal) {
                this.close();
            }
        });
    }

    isOpen() {
        return this.modal.classList.contains('active');
    }

    open(trigger = null) {
        closeAllModals(this.modal);
        this.lastTrigger = trigger || document.activeElement;
        this.modal.classList.add('active');
        this._syncHiddenState();
        this._focusFirstElement();
        document.body.classList.add('antsand-modal-open');
        this.modal.dispatchEvent(new CustomEvent('antsand:modal:open', { bubbles: true }));
    }

    close() {
        this.modal.classList.remove('active');
        this._syncHiddenState();
        if (document.querySelectorAll('.antsand-modal.active').length === 0) {
            document.body.classList.remove('antsand-modal-open');
        }
        if (this.lastTrigger && typeof this.lastTrigger.focus === 'function') {
            this.lastTrigger.focus();
        }
        this.modal.dispatchEvent(new CustomEvent('antsand:modal:close', { bubbles: true }));
    }

    toggle(trigger = null) {
        this.isOpen() ? this.close() : this.open(trigger);
    }

    _syncHiddenState() {
        this.modal.setAttribute('aria-hidden', this.isOpen() ? 'false' : 'true');
    }

    _focusFirstElement() {
        const focusable = this.modal.querySelector([
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', '));

        focusable?.focus();
    }
}

function getModalTarget(trigger) {
    const selector = trigger.dataset.modalTarget ||
        trigger.dataset.modalOpen ||
        trigger.dataset.antsandModalTarget;

    return selector ? document.querySelector(selector) : null;
}

function getModalInstance(modal) {
    if (!modal.__antsandModal) {
        modal.__antsandModal = new AntsandModal(modal);
    }
    return modal.__antsandModal;
}

function openModal(selectorOrElement, trigger = null) {
    const modal = typeof selectorOrElement === 'string'
        ? document.querySelector(selectorOrElement)
        : selectorOrElement;
    if (!modal) return null;
    const instance = getModalInstance(modal);
    instance.open(trigger);
    return instance;
}

function closeModal(selectorOrElement) {
    const modal = typeof selectorOrElement === 'string'
        ? document.querySelector(selectorOrElement)
        : selectorOrElement;
    if (!modal) return;
    getModalInstance(modal).close();
}

function closeAllModals(except = null) {
    document.querySelectorAll('.antsand-modal.active').forEach(modal => {
        if (except && modal === except) return;
        getModalInstance(modal).close();
    });
}

function initAllModals() {
    const instances = [];

    document.querySelectorAll('.antsand-modal').forEach(modal => {
        if (modal.dataset.modalInit !== 'true') {
            const instance = new AntsandModal(modal);
            modal.__antsandModal = instance;
            instances.push(instance);
        }
    });

    document.querySelectorAll(OPEN_SELECTORS).forEach(trigger => {
        if (trigger.dataset.modalTriggerInit === 'true') return;
        if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) {
            trigger.setAttribute('type', 'button');
        }
        trigger.addEventListener('click', (event) => {
            const target = getModalTarget(trigger);
            if (!target) return;
            event.preventDefault();
            openModal(target, trigger);
        });
        trigger.dataset.modalTriggerInit = 'true';
    });

    return instances;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const activeModals = Array.from(document.querySelectorAll('.antsand-modal.active'));
        const topModal = activeModals[activeModals.length - 1];
        if (topModal && !topModal.hasAttribute('data-modal-static')) {
            getModalInstance(topModal).close();
        }
    }
});

export { AntsandModal, initAllModals, openModal, closeModal, closeAllModals };
export default AntsandModal;
