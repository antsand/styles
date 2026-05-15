/**
 * ANTSAND Alert Module (ES6)
 *
 * Progressive enhancement for Sass v2 alerts. Static alerts render without JS;
 * JS only adds dismiss behavior, ARIA defaults, and custom events.
 */

class AntsandAlert {
    constructor(alert) {
        this.alert = typeof alert === 'string'
            ? document.querySelector(alert)
            : alert;

        if (!this.alert || this.alert.dataset.alertInit === 'true') return;

        this.closeButtons = this.alert.querySelectorAll('.antsand-alert-close, [data-alert-close]');

        this._init();
        this.alert.dataset.alertInit = 'true';
    }

    _init() {
        if (!this.alert.hasAttribute('role')) {
            const isImportant = this.alert.classList.contains('antsand-alert-danger') ||
                this.alert.classList.contains('antsand-alert-warning');
            this.alert.setAttribute('role', isImportant ? 'alert' : 'status');
        }

        this.closeButtons.forEach(button => {
            if (button.tagName === 'BUTTON' && !button.hasAttribute('type')) {
                button.setAttribute('type', 'button');
            }
            if (!button.hasAttribute('aria-label')) {
                button.setAttribute('aria-label', 'Close alert');
            }
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.dismiss();
            });
        });
    }

    dismiss() {
        if (!this.alert || this.alert.dataset.alertDismissing === 'true') return;

        this.alert.dataset.alertDismissing = 'true';
        this.alert.classList.add('fade-out');
        this.alert.dispatchEvent(new CustomEvent('antsand:alert:dismiss', { bubbles: true }));

        const removeAlert = () => {
            this.alert?.remove();
            this.alert = null;
        };

        this.alert.addEventListener('animationend', removeAlert, { once: true });
        this.alert.addEventListener('transitionend', removeAlert, { once: true });
        window.setTimeout(removeAlert, 350);
    }
}

function initAllAlerts() {
    const instances = [];
    document.querySelectorAll('.antsand-alert').forEach(alert => {
        if (alert.dataset.alertInit !== 'true') {
            instances.push(new AntsandAlert(alert));
        }
    });
    return instances;
}

export { AntsandAlert, initAllAlerts };
export default AntsandAlert;
