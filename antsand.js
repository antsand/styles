// ============================================
// ANTSAND Styles v2 - JavaScript
// Interactive components functionality
// ============================================

const Antsand = {
  // Accordion functionality
  accordion: {
    init: function(selector = '.antsand-accordion') {
      document.querySelectorAll(selector).forEach(accordion => {
        const headers = accordion.querySelectorAll('.antsand-accordion-header');

        headers.forEach(header => {
          header.addEventListener('click', () => {
            const item = header.closest('.antsand-accordion-item');
            const body = item.querySelector('.antsand-accordion-body');
            const icon = header.querySelector('.antsand-accordion-icon');
            const isActive = body.classList.contains('active');

            // Close all other items (optional - remove for multi-open)
            accordion.querySelectorAll('.antsand-accordion-body').forEach(b => {
              if (b !== body) {
                b.classList.remove('active');
                b.closest('.antsand-accordion-item')
                  .querySelector('.antsand-accordion-header').classList.remove('active');
                b.closest('.antsand-accordion-item')
                  .querySelector('.antsand-accordion-icon')?.classList.remove('active');
              }
            });

            // Toggle current item
            body.classList.toggle('active', !isActive);
            header.classList.toggle('active', !isActive);
            icon?.classList.toggle('active', !isActive);
          });
        });
      });
    }
  },

  // Tabs functionality
  tabs: {
    init: function(selector = '.antsand-tabs') {
      document.querySelectorAll(selector).forEach(tabContainer => {
        const tabItems = tabContainer.querySelectorAll('.antsand-tab-item');
        const tabPanes = tabContainer.querySelectorAll('.antsand-tab-pane');

        tabItems.forEach((tab, index) => {
          tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabItems.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            if (tabPanes[index]) {
              tabPanes[index].classList.add('active');
            }
          });
        });
      });
    }
  },

  // Modal functionality
  modal: {
    init: function() {
      // Open modal
      document.querySelectorAll('[data-modal-open]').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const modalId = trigger.getAttribute('data-modal-open');
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        });
      });

      // Close modal
      document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          const modal = closeBtn.closest('.antsand-modal');
          if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      });

      // Close on backdrop click
      document.querySelectorAll('.antsand-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.antsand-modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          });
        }
      });
    }
  },

  // Navbar mobile toggle
  navbar: {
    init: function(selector = '.antsand-navbar') {
      document.querySelectorAll(selector).forEach(navbar => {
        const toggle = navbar.querySelector('.antsand-navbar-toggle');
        const nav = navbar.querySelector('.antsand-navbar-nav');
        const icon = navbar.querySelector('.antsand-navbar-toggle-icon');

        if (toggle && nav) {
          toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            icon?.classList.toggle('active');
          });
        }
      });
    }
  },

  // Dropdown functionality
  dropdown: {
    init: function(selector = '.antsand-dropdown') {
      document.querySelectorAll(selector).forEach(dropdown => {
        const toggle = dropdown.querySelector('.antsand-dropdown-toggle');
        const menu = dropdown.querySelector('.antsand-dropdown-menu');

        if (toggle && menu) {
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            document.querySelectorAll('.antsand-dropdown-menu.active').forEach(m => {
              if (m !== menu) {
                m.classList.remove('active');
                m.previousElementSibling?.classList.remove('active');
              }
            });

            // Toggle current dropdown
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
          });

          // Close dropdown when clicking outside
          document.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
          });

          // Prevent closing when clicking inside menu
          menu.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        }
      });
    }
  },

  // Alert dismissible
  alert: {
    init: function(selector = '.antsand-alert') {
      document.querySelectorAll(selector).forEach(alert => {
        const closeBtn = alert.querySelector('.antsand-alert-close');

        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            alert.classList.add('fade-out');
            setTimeout(() => {
              alert.remove();
            }, 250);
          });
        }
      });
    }
  },

  // Initialize all components
  init: function() {
    this.accordion.init();
    this.tabs.init();
    this.modal.init();
    this.navbar.init();
    this.dropdown.init();
    this.alert.init();
  }
};

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Antsand.init());
  } else {
    Antsand.init();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Antsand;
}
