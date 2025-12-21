/**
 * ANTSAND Components - Unified Interactive Components Bundle
 *
 * This file combines all interactive ANTSAND components:
 * - AntTable (sortable tables with search and pagination)
 * - AntCarousel (slide, fade, cards, cover variants with touch support)
 * - AntTabs (tab navigation)
 *
 * Auto-initializes based on data attributes:
 * - [data-ant-table] - Initialize table
 * - [data-carousel] - Initialize carousel
 * - [data-tabs] - Initialize tabs
 *
 * Usage: Include this script at the end of body
 * <script src="/js/antsand-components.js"></script>
 */

(function() {
    'use strict';

    // =============================================================================
    // ANT TABLE
    // =============================================================================
    class AntTable {
        constructor(element, options = {}) {
            this.container = typeof element === 'string'
                ? document.querySelector(element)
                : element;

            if (!this.container) {
                console.warn('AntTable: Container element not found');
                return;
            }

            this.table = this.container.querySelector('table');
            if (!this.table) {
                console.warn('AntTable: No table found in container');
                return;
            }

            this.options = {
                sortable: true,
                searchable: false,
                paginate: false,
                perPage: 10,
                onSort: null,
                onSearch: null,
                onPageChange: null,
                ...options
            };

            this.state = {
                sortColumn: null,
                sortDirection: 'asc',
                searchQuery: '',
                currentPage: 1,
                originalRows: [],
                filteredRows: []
            };

            this.init();
        }

        init() {
            const tbody = this.table.querySelector('tbody');
            if (tbody) {
                this.state.originalRows = Array.from(tbody.querySelectorAll('tr'));
                this.state.filteredRows = [...this.state.originalRows];
            }

            if (this.options.sortable) this.initSorting();
            if (this.options.searchable) this.initSearch();
            if (this.options.paginate) this.initPagination();

            this.container.dataset.antTableInit = 'true';
        }

        initSorting() {
            const headers = this.table.querySelectorAll('th');
            headers.forEach((th, index) => {
                if (!th.classList.contains('no-sort')) {
                    th.classList.add('sortable');
                    th.style.cursor = 'pointer';
                    th.setAttribute('role', 'columnheader');
                    th.setAttribute('aria-sort', 'none');
                    th.addEventListener('click', () => this.sortByColumn(index, th));
                }
            });
        }

        sortByColumn(columnIndex, headerElement) {
            const tbody = this.table.querySelector('tbody');
            if (!tbody) return;

            let direction = 'asc';
            if (this.state.sortColumn === columnIndex && this.state.sortDirection === 'asc') {
                direction = 'desc';
            }

            this.state.sortColumn = columnIndex;
            this.state.sortDirection = direction;

            this.table.querySelectorAll('th').forEach(th => {
                th.classList.remove('asc', 'desc');
                th.setAttribute('aria-sort', 'none');
            });
            headerElement.classList.add(direction);
            headerElement.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');

            const sortedRows = this.sortRows(this.state.filteredRows, columnIndex, direction);
            this.state.filteredRows = sortedRows;
            this.renderRows();

            if (typeof this.options.onSort === 'function') {
                this.options.onSort(columnIndex, direction);
            }
        }

        sortRows(rows, columnIndex, direction) {
            return [...rows].sort((rowA, rowB) => {
                const cellA = rowA.cells[columnIndex];
                const cellB = rowB.cells[columnIndex];
                if (!cellA || !cellB) return 0;

                let valueA = cellA.dataset.sortValue !== undefined ? cellA.dataset.sortValue : cellA.textContent.trim();
                let valueB = cellB.dataset.sortValue !== undefined ? cellB.dataset.sortValue : cellB.textContent.trim();

                const comparison = this.compareValues(valueA, valueB);
                return direction === 'asc' ? comparison : -comparison;
            });
        }

        compareValues(a, b) {
            if (a === '' && b === '') return 0;
            if (a === '') return 1;
            if (b === '') return -1;

            const numA = parseFloat(a.replace(/[$,]/g, ''));
            const numB = parseFloat(b.replace(/[$,]/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

            const dateA = new Date(a);
            const dateB = new Date(b);
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                return dateA.getTime() - dateB.getTime();
            }

            return a.toLowerCase().localeCompare(b.toLowerCase());
        }

        initSearch() {
            let searchInput = this.container.querySelector('.ant-table__search input');
            if (!searchInput) {
                const controls = document.createElement('div');
                controls.className = 'ant-table__controls';
                controls.innerHTML = '<div class="ant-table__search"><input type="text" placeholder="Search..."></div>';
                this.container.insertBefore(controls, this.table);
                searchInput = controls.querySelector('input');
            }

            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.search(e.target.value), 200);
            });
        }

        search(query) {
            this.state.searchQuery = query.toLowerCase().trim();
            this.state.currentPage = 1;

            if (this.state.searchQuery === '') {
                this.state.filteredRows = [...this.state.originalRows];
            } else {
                this.state.filteredRows = this.state.originalRows.filter(row => {
                    return row.textContent.toLowerCase().includes(this.state.searchQuery);
                });
            }

            if (this.state.sortColumn !== null) {
                this.state.filteredRows = this.sortRows(
                    this.state.filteredRows,
                    this.state.sortColumn,
                    this.state.sortDirection
                );
            }

            this.renderRows();
            if (typeof this.options.onSearch === 'function') {
                this.options.onSearch(query, this.state.filteredRows.length);
            }
        }

        initPagination() {
            this.renderPagination();
        }

        renderPagination() {
            const existingPagination = this.container.querySelector('.ant-table__pagination');
            if (existingPagination) existingPagination.remove();

            const totalRows = this.state.filteredRows.length;
            const totalPages = Math.ceil(totalRows / this.options.perPage);
            if (totalPages <= 1) return;

            const pagination = document.createElement('div');
            pagination.className = 'ant-table__pagination';

            const start = (this.state.currentPage - 1) * this.options.perPage + 1;
            const end = Math.min(this.state.currentPage * this.options.perPage, totalRows);

            pagination.innerHTML = `
                <div class="ant-table__pagination-info">Showing ${start} to ${end} of ${totalRows} entries</div>
                <div class="ant-table__pagination-buttons">
                    <button class="ant-table__pagination-btn" data-page="prev" ${this.state.currentPage === 1 ? 'disabled' : ''}>Prev</button>
                    ${this.generatePageButtons(totalPages)}
                    <button class="ant-table__pagination-btn" data-page="next" ${this.state.currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
            `;

            this.container.appendChild(pagination);
            pagination.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => this.handlePageClick(btn.dataset.page, totalPages));
            });
        }

        generatePageButtons(totalPages) {
            let buttons = '';
            const current = this.state.currentPage;
            const delta = 2;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
                    buttons += `<button class="ant-table__pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
                } else if (i === current - delta - 1 || i === current + delta + 1) {
                    buttons += '<span style="padding: 0 8px;">...</span>';
                }
            }
            return buttons;
        }

        handlePageClick(page, totalPages) {
            if (page === 'prev') {
                this.state.currentPage = Math.max(1, this.state.currentPage - 1);
            } else if (page === 'next') {
                this.state.currentPage = Math.min(totalPages, this.state.currentPage + 1);
            } else {
                this.state.currentPage = parseInt(page);
            }

            this.renderRows();
            this.renderPagination();
            if (typeof this.options.onPageChange === 'function') {
                this.options.onPageChange(this.state.currentPage);
            }
        }

        renderRows() {
            const tbody = this.table.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = '';
            let rowsToShow = this.state.filteredRows;

            if (this.options.paginate) {
                const start = (this.state.currentPage - 1) * this.options.perPage;
                const end = start + this.options.perPage;
                rowsToShow = rowsToShow.slice(start, end);
            }

            if (rowsToShow.length === 0) {
                const emptyRow = document.createElement('tr');
                const cols = this.table.querySelectorAll('th').length || 1;
                emptyRow.innerHTML = `<td colspan="${cols}" style="text-align: center; padding: 40px; color: #64748b;">No matching records found</td>`;
                tbody.appendChild(emptyRow);
                return;
            }

            rowsToShow.forEach(row => tbody.appendChild(row.cloneNode(true)));
            if (this.options.paginate) this.renderPagination();
        }

        refresh() {
            const tbody = this.table.querySelector('tbody');
            if (tbody) {
                this.state.originalRows = Array.from(tbody.querySelectorAll('tr'));
                this.state.filteredRows = [...this.state.originalRows];
            }
            this.renderRows();
        }

        destroy() {
            const controls = this.container.querySelector('.ant-table__controls');
            if (controls) controls.remove();
            const pagination = this.container.querySelector('.ant-table__pagination');
            if (pagination) pagination.remove();
            this.table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sortable', 'asc', 'desc');
                th.style.cursor = '';
            });
            delete this.container.dataset.antTableInit;
        }
    }

    // =============================================================================
    // ANT CAROUSEL
    // =============================================================================
    class AntCarousel {
        constructor(element, options = {}) {
            this.container = typeof element === 'string'
                ? document.querySelector(element)
                : element;

            if (!this.container) {
                console.warn('AntCarousel: Container element not found');
                return;
            }

            this.options = {
                autoplay: this.container.dataset.autoplay === 'true',
                interval: parseInt(this.container.dataset.interval) || 5000,
                pauseOnHover: true,
                touch: true,
                keyboard: true,
                wrap: true,
                ...options
            };

            this.state = {
                currentIndex: 0,
                isPlaying: false,
                autoplayTimer: null,
                touchStartX: 0,
                touchEndX: 0,
                isDragging: false
            };

            this.track = this.container.querySelector('[data-track]') ||
                         this.container.querySelector('.carousel-track');
            this.items = this.track ? Array.from(this.track.querySelectorAll('.carousel-item')) : [];
            this.indicators = Array.from(this.container.querySelectorAll('[data-carousel-indicator]'));
            this.prevBtn = this.container.querySelector('[data-carousel-control="prev"]');
            this.nextBtn = this.container.querySelector('[data-carousel-control="next"]');

            if (this.items.length === 0) {
                console.warn('AntCarousel: No carousel items found');
                return;
            }

            this.init();
        }

        init() {
            this.state.currentIndex = this.items.findIndex(item => item.classList.contains('active'));
            if (this.state.currentIndex === -1) {
                this.state.currentIndex = 0;
                this.items[0]?.classList.add('active');
            }

            this.bindControls();
            if (this.options.touch) this.bindTouch();
            if (this.options.keyboard) this.bindKeyboard();

            if (this.options.autoplay) {
                this.startAutoplay();
                if (this.options.pauseOnHover) {
                    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
                    this.container.addEventListener('mouseleave', () => this.startAutoplay());
                }
            }

            this.container.dataset.carouselInit = 'true';
            this.updateDisplay();
        }

        bindControls() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => { e.preventDefault(); this.prev(); });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => { e.preventDefault(); this.next(); });
            }
            this.indicators.forEach((indicator) => {
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goTo(parseInt(indicator.dataset.carouselIndicator));
                });
            });
        }

        bindTouch() {
            this.container.addEventListener('touchstart', (e) => {
                this.state.touchStartX = e.touches[0].clientX;
                this.state.isDragging = true;
            }, { passive: true });

            this.container.addEventListener('touchmove', (e) => {
                if (!this.state.isDragging) return;
                this.state.touchEndX = e.touches[0].clientX;
            }, { passive: true });

            this.container.addEventListener('touchend', () => {
                if (!this.state.isDragging) return;
                this.state.isDragging = false;
                this.handleSwipe();
            });

            // Mouse drag
            this.container.addEventListener('mousedown', (e) => {
                this.state.touchStartX = e.clientX;
                this.state.isDragging = true;
                this.container.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.state.isDragging) return;
                this.state.touchEndX = e.clientX;
            });

            document.addEventListener('mouseup', () => {
                if (!this.state.isDragging) return;
                this.state.isDragging = false;
                this.container.style.cursor = '';
                this.handleSwipe();
            });
        }

        handleSwipe() {
            const diff = this.state.touchStartX - this.state.touchEndX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) this.next();
                else this.prev();
            }

            this.state.touchStartX = 0;
            this.state.touchEndX = 0;
        }

        bindKeyboard() {
            this.container.setAttribute('tabindex', '0');
            this.container.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowLeft': e.preventDefault(); this.prev(); break;
                    case 'ArrowRight': e.preventDefault(); this.next(); break;
                    case 'Home': e.preventDefault(); this.goTo(0); break;
                    case 'End': e.preventDefault(); this.goTo(this.items.length - 1); break;
                }
            });
        }

        prev() {
            let newIndex = this.state.currentIndex - 1;
            if (newIndex < 0) newIndex = this.options.wrap ? this.items.length - 1 : 0;
            this.goTo(newIndex);
        }

        next() {
            let newIndex = this.state.currentIndex + 1;
            if (newIndex >= this.items.length) newIndex = this.options.wrap ? 0 : this.items.length - 1;
            this.goTo(newIndex);
        }

        goTo(index) {
            if (index < 0 || index >= this.items.length || index === this.state.currentIndex) return;

            const prevIndex = this.state.currentIndex;
            this.state.currentIndex = index;
            this.updateDisplay(prevIndex);

            this.container.dispatchEvent(new CustomEvent('carousel:change', {
                detail: { currentIndex: index, previousIndex: prevIndex }
            }));
        }

        updateDisplay() {
            const isFadeVariant = this.container.classList.contains('antsand-carousel-fade');
            const isCardsVariant = this.container.classList.contains('antsand-carousel-cards');

            this.items.forEach((item, index) => {
                item.classList.toggle('active', index === this.state.currentIndex);
            });

            if (!isFadeVariant && this.track) {
                if (isCardsVariant) {
                    const itemWidth = this.items[0]?.offsetWidth || 0;
                    const gap = 16;
                    const offset = this.state.currentIndex * (itemWidth + gap);
                    this.track.style.transform = `translateX(-${offset}px)`;
                } else {
                    const offset = this.state.currentIndex * 100;
                    this.track.style.transform = `translateX(-${offset}%)`;
                }
            }

            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.state.currentIndex);
            });

            if (!this.options.wrap) {
                if (this.prevBtn) this.prevBtn.disabled = this.state.currentIndex === 0;
                if (this.nextBtn) this.nextBtn.disabled = this.state.currentIndex === this.items.length - 1;
            }
        }

        startAutoplay() {
            if (this.state.isPlaying) return;
            this.state.isPlaying = true;
            this.state.autoplayTimer = setInterval(() => this.next(), this.options.interval);
        }

        pauseAutoplay() {
            this.state.isPlaying = false;
            if (this.state.autoplayTimer) {
                clearInterval(this.state.autoplayTimer);
                this.state.autoplayTimer = null;
            }
        }

        stopAutoplay() {
            this.pauseAutoplay();
            this.options.autoplay = false;
        }

        destroy() {
            this.stopAutoplay();
            delete this.container.dataset.carouselInit;
        }
    }

    // =============================================================================
    // ANT TABS
    // =============================================================================
    class AntTabs {
        constructor(element, options = {}) {
            this.container = typeof element === 'string'
                ? document.querySelector(element)
                : element;

            if (!this.container) {
                console.warn('AntTabs: Container element not found');
                return;
            }

            this.options = {
                activeClass: 'active',
                onChange: null,
                ...options
            };

            this.tabs = Array.from(this.container.querySelectorAll('[data-tab]'));
            this.panels = Array.from(this.container.querySelectorAll('[data-tab-panel]'));

            if (this.tabs.length === 0) {
                console.warn('AntTabs: No tabs found');
                return;
            }

            this.init();
        }

        init() {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.activate(tab.dataset.tab);
                });
            });

            // Activate first tab if none active
            const activeTab = this.tabs.find(t => t.classList.contains(this.options.activeClass));
            if (!activeTab && this.tabs[0]) {
                this.activate(this.tabs[0].dataset.tab);
            }

            this.container.dataset.tabsInit = 'true';
        }

        activate(tabId) {
            // Update tab buttons
            this.tabs.forEach(tab => {
                tab.classList.toggle(this.options.activeClass, tab.dataset.tab === tabId);
                tab.setAttribute('aria-selected', tab.dataset.tab === tabId);
            });

            // Update panels
            this.panels.forEach(panel => {
                const isActive = panel.dataset.tabPanel === tabId;
                panel.classList.toggle(this.options.activeClass, isActive);
                panel.hidden = !isActive;
            });

            // Callback
            if (typeof this.options.onChange === 'function') {
                this.options.onChange(tabId);
            }

            // Dispatch event
            this.container.dispatchEvent(new CustomEvent('tabs:change', {
                detail: { tabId }
            }));
        }

        destroy() {
            delete this.container.dataset.tabsInit;
        }
    }

    // =============================================================================
    // AUTO-INITIALIZE ALL COMPONENTS
    // =============================================================================
    function initAllComponents() {
        // Tables
        document.querySelectorAll('[data-ant-table]:not([data-ant-table-init])').forEach(el => {
            const options = {
                sortable: el.dataset.sortable !== 'false',
                searchable: el.dataset.searchable === 'true',
                paginate: el.dataset.paginate === 'true',
                perPage: parseInt(el.dataset.perPage) || 10
            };
            new AntTable(el, options);
        });

        // Carousels
        document.querySelectorAll('[data-carousel]:not([data-carousel-init])').forEach(el => {
            new AntCarousel(el);
        });

        // Tabs
        document.querySelectorAll('[data-tabs]:not([data-tabs-init])').forEach(el => {
            new AntTabs(el);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllComponents);
    } else {
        initAllComponents();
    }

    // Re-initialize on dynamic content (for AJAX-loaded content)
    document.addEventListener('antsand:init', initAllComponents);

    // Expose globally
    window.AntTable = AntTable;
    window.AntCarousel = AntCarousel;
    window.AntTabs = AntTabs;
    window.initAntsandComponents = initAllComponents;

})();
