/**
 * ANTSAND v2 - Payment Checkout helpers
 *
 * Keeps checkout scroll/sticky state in shared JS instead of renderer templates.
 */

class AntsandCheckout {
    constructor(shell) {
        this.shell = shell;
        this.summary = shell.querySelector('.payment-checkout-summary-panel');
        this.handleScroll = this.handleScroll.bind(this);
        this.init();
    }

    init() {
        if (!this.summary) return;
        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleScroll, { passive: true });
    }

    handleScroll() {
        if (!this.summary || window.matchMedia('(max-width: 860px)').matches) {
            this.summary?.classList.remove('is-stuck');
            return;
        }

        const top = this.summary.getBoundingClientRect().top;
        this.summary.classList.toggle('is-stuck', top <= 24);
    }
}

function initAllCheckouts() {
    const checkouts = [];
    document.querySelectorAll('.payment-checkout-shell').forEach(shell => {
        if (shell.dataset.antsandCheckoutInitialized === 'true') return;
        shell.dataset.antsandCheckoutInitialized = 'true';
        checkouts.push(new AntsandCheckout(shell));
    });
    return checkouts;
}

export { AntsandCheckout, initAllCheckouts };
