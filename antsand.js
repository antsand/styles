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

  // Tabs functionality (Universal - variant-agnostic)
  tabs: {
    init: function(selector = '[data-tabs]') {
      // Universal selector - works with ANY variant
      const tabContainers = document.querySelectorAll(selector);

      tabContainers.forEach(container => {
        // Universal class names
        const tabs = container.querySelectorAll('.tabs-item');
        const contents = container.querySelectorAll('.tabs-content');

        if (tabs.length === 0) return;

        tabs.forEach((tab, index) => {
          tab.addEventListener('click', function(e) {
            e.preventDefault();

            // Get target ID from data-tab attribute
            const targetId = this.getAttribute('data-tab');

            // Deactivate all tabs
            tabs.forEach(t => {
              t.classList.remove('active');
              t.setAttribute('aria-selected', 'false');
              t.setAttribute('tabindex', '-1');
            });

            // Activate clicked tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            this.setAttribute('tabindex', '0');

            // Deactivate all content panes
            contents.forEach(pane => pane.classList.remove('active'));

            // Activate target content by ID or index
            if (targetId) {
              const targetContent = document.getElementById(targetId.replace('data-tab=', ''));
              if (targetContent) {
                targetContent.classList.add('active');
              }
            } else if (contents[index]) {
              contents[index].classList.add('active');
            }

            // Trigger custom event
            const event = new CustomEvent('antsand:tab:changed', {
              detail: {
                tabIndex: index,
                tab: this,
                content: contents[index],
                container: container
              }
            });
            container.dispatchEvent(event);
          });

          // Keyboard navigation (ARIA compliant)
          tab.addEventListener('keydown', function(e) {
            let newTab = null;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              newTab = tabs[(index + 1) % tabs.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              newTab = tabs[(index - 1 + tabs.length) % tabs.length];
            } else if (e.key === 'Home') {
              e.preventDefault();
              newTab = tabs[0];
            } else if (e.key === 'End') {
              e.preventDefault();
              newTab = tabs[tabs.length - 1];
            }

            if (newTab) {
              newTab.focus();
              newTab.click();
            }
          });

          // Set ARIA attributes
          tab.setAttribute('role', 'tab');
          tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
          tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
        });

        // Set container ARIA role
        const tabsHeader = container.querySelector('.tabs-header');
        if (tabsHeader) {
          tabsHeader.setAttribute('role', 'tablist');
        }

        // Set content ARIA attributes
        contents.forEach((content, index) => {
          content.setAttribute('role', 'tabpanel');
          content.setAttribute('aria-labelledby', tabs[index] ? tabs[index].getAttribute('data-tab') : '');
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

  // Enhanced Navigation with click-based dropdowns
  nav: {
    init: function(selector = '.antsand-nav') {
      document.querySelectorAll(selector).forEach(nav => {
        // Handle dropdown containers
        const dropdownContainers = nav.querySelectorAll('.drop-down-container');

        dropdownContainers.forEach(container => {
          const trigger = container.querySelector('a');
          const dropdown = container.querySelector('.drop-down');

          if (trigger && dropdown) {
            // Click handler for dropdown toggle
            trigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();

              // Close all other dropdowns
              dropdownContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                  otherContainer.classList.remove('drop-active');
                  const otherDropdown = otherContainer.querySelector('.drop-down');
                  if (otherDropdown) {
                    otherDropdown.classList.remove('active');
                  }
                }
              });

              // Toggle current dropdown
              container.classList.toggle('drop-active');
              dropdown.classList.toggle('active');
            });
          }
        });

        // Handle mobile toggle
        const mobileToggle = nav.querySelector('.mobile_toggle');
        const navContainer = nav.querySelector('.antsand-nav-container');

        if (mobileToggle && navContainer) {
          mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navContainer.classList.toggle('nav-open');
          });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
          if (!nav.contains(e.target)) {
            dropdownContainers.forEach(container => {
              container.classList.remove('drop-active');
              const dropdown = container.querySelector('.drop-down');
              if (dropdown) {
                dropdown.classList.remove('active');
              }
            });
          }
        });

        // Close dropdowns on ESC key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            dropdownContainers.forEach(container => {
              container.classList.remove('drop-active');
              const dropdown = container.querySelector('.drop-down');
              if (dropdown) {
                dropdown.classList.remove('active');
              }
            });
          }
        });

        // Handle tabs within dropdowns
        const dropdownTabs = nav.querySelectorAll('[data-antsand-tabs-dropdown]');
        dropdownTabs.forEach(tabContainer => {
          const tabs = tabContainer.querySelectorAll('.dropdown-tab');

          tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent dropdown from closing

              const targetId = tab.getAttribute('data-tab');

              // Deactivate all tabs in this group
              tabs.forEach(t => t.classList.remove('active'));

              // Activate clicked tab
              tab.classList.add('active');

              // Deactivate all content panes
              const parentDropdown = tabContainer.closest('.drop-down');
              const allContent = parentDropdown.querySelectorAll('.dropdown-tab-content');
              allContent.forEach(pane => pane.classList.remove('active'));

              // Activate target content
              const targetContent = document.getElementById(targetId);
              if (targetContent) {
                targetContent.classList.add('active');
              }
            });
          });
        });
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
    this.nav.init();
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
