/**
 * ANTSAND Table Module (ES6)
 *
 * Follows ANTSAND Universal Structure:
 * - Parent class controls variant styling (ant-table, ant-table-material, etc.)
 * - Data structure: section > header > data (rows) > footer
 *
 * HTML Structure:
 * <div class="ant-table {variant}" data-table>
 *   <div class="table-header">           <!-- Optional: search, filters -->
 *     <div class="table-search">...</div>
 *   </div>
 *   <div class="table-data">             <!-- Main table container -->
 *     <table>
 *       <thead>...</thead>
 *       <tbody>...</tbody>
 *     </table>
 *   </div>
 *   <div class="table-footer">           <!-- Optional: pagination -->
 *     <div class="table-pagination">...</div>
 *   </div>
 * </div>
 *
 * Features:
 * - Click-to-sort columns
 * - Search/filter
 * - Pagination
 * - Auto-detect data types (string, number, date)
 */

class AntsandTable {
    constructor(container, options = {}) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.warn('AntsandTable: Container not found');
            return;
        }

        // Check if already initialized
        if (this.container.dataset.tableInit === 'true') {
            return;
        }

        this.table = this.container.querySelector('table');
        if (!this.table) {
            console.warn('AntsandTable: No table found in container');
            return;
        }

        // Default options
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

        // Parse data attributes
        this.parseDataAttributes();

        // State
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

    parseDataAttributes() {
        const el = this.container;
        if (el.dataset.sortable === 'false') this.options.sortable = false;
        if (el.dataset.searchable === 'true') this.options.searchable = true;
        if (el.dataset.paginate === 'true') this.options.paginate = true;
        if (el.dataset.perPage) this.options.perPage = parseInt(el.dataset.perPage) || 10;
    }

    init() {
        // Store original rows
        const tbody = this.table.querySelector('tbody');
        if (tbody) {
            this.state.originalRows = Array.from(tbody.querySelectorAll('tr'));
            this.state.filteredRows = [...this.state.originalRows];
        }

        // Initialize features
        if (this.options.sortable) this.initSorting();
        if (this.options.searchable) this.initSearch();
        if (this.options.paginate) this.initPagination();

        // Mark as initialized
        this.container.dataset.tableInit = 'true';
    }

    // =========================================================================
    // SORTING
    // =========================================================================
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

        // Determine direction
        let direction = 'asc';
        if (this.state.sortColumn === columnIndex && this.state.sortDirection === 'asc') {
            direction = 'desc';
        }

        // Update state
        this.state.sortColumn = columnIndex;
        this.state.sortDirection = direction;

        // Update header classes
        this.table.querySelectorAll('th').forEach(th => {
            th.classList.remove('asc', 'desc');
            th.setAttribute('aria-sort', 'none');
        });
        headerElement.classList.add(direction);
        headerElement.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');

        // Sort and render
        this.state.filteredRows = this.sortRows(this.state.filteredRows, columnIndex, direction);
        this.renderRows();

        // Callback
        if (typeof this.options.onSort === 'function') {
            this.options.onSort(columnIndex, direction);
        }

        // Dispatch event
        this.container.dispatchEvent(new CustomEvent('antsand:table:sorted', {
            detail: { column: columnIndex, direction },
            bubbles: true
        }));
    }

    sortRows(rows, columnIndex, direction) {
        return [...rows].sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex];
            const cellB = rowB.cells[columnIndex];

            if (!cellA || !cellB) return 0;

            const valueA = this.getCellValue(cellA);
            const valueB = this.getCellValue(cellB);
            const comparison = this.compareValues(valueA, valueB);

            return direction === 'asc' ? comparison : -comparison;
        });
    }

    getCellValue(cell) {
        // Check data-sort-value first
        if (cell.dataset.sortValue !== undefined) {
            return cell.dataset.sortValue;
        }
        return cell.textContent.trim();
    }

    compareValues(a, b) {
        // Handle empty
        if (a === '' && b === '') return 0;
        if (a === '') return 1;
        if (b === '') return -1;

        // Try numeric
        const numA = parseFloat(a.replace(/[$,]/g, ''));
        const numB = parseFloat(b.replace(/[$,]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }

        // Try date
        const dateA = new Date(a);
        const dateB = new Date(b);

        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateA.getTime() - dateB.getTime();
        }

        // String comparison
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    // =========================================================================
    // SEARCH
    // =========================================================================
    initSearch() {
        let searchInput = this.container.querySelector('.table-search input');

        if (!searchInput) {
            // Create search in table-header
            let header = this.container.querySelector('.table-header');
            if (!header) {
                header = document.createElement('div');
                header.className = 'table-header';
                this.container.insertBefore(header, this.container.firstChild);
            }

            const searchDiv = document.createElement('div');
            searchDiv.className = 'table-search';
            searchDiv.innerHTML = '<input type="text" placeholder="Search...">';
            header.appendChild(searchDiv);
            searchInput = searchDiv.querySelector('input');
        }

        // Debounced search
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.search(e.target.value);
            }, 200);
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

        // Re-apply sort
        if (this.state.sortColumn !== null) {
            this.state.filteredRows = this.sortRows(
                this.state.filteredRows,
                this.state.sortColumn,
                this.state.sortDirection
            );
        }

        this.renderRows();

        // Callback
        if (typeof this.options.onSearch === 'function') {
            this.options.onSearch(query, this.state.filteredRows.length);
        }

        // Dispatch event
        this.container.dispatchEvent(new CustomEvent('antsand:table:searched', {
            detail: { query, resultCount: this.state.filteredRows.length },
            bubbles: true
        }));
    }

    // =========================================================================
    // PAGINATION
    // =========================================================================
    initPagination() {
        this.renderPagination();
    }

    renderPagination() {
        // Remove existing
        const existing = this.container.querySelector('.table-footer .table-pagination');
        if (existing) existing.remove();

        const totalRows = this.state.filteredRows.length;
        const totalPages = Math.ceil(totalRows / this.options.perPage);

        if (totalPages <= 1) return;

        // Get or create footer
        let footer = this.container.querySelector('.table-footer');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'table-footer';
            this.container.appendChild(footer);
        }

        const pagination = document.createElement('div');
        pagination.className = 'table-pagination';

        const start = (this.state.currentPage - 1) * this.options.perPage + 1;
        const end = Math.min(this.state.currentPage * this.options.perPage, totalRows);

        pagination.innerHTML = `
            <div class="pagination-info">
                Showing ${start} to ${end} of ${totalRows} entries
            </div>
            <div class="pagination-buttons">
                <button class="pagination-btn" data-page="prev" ${this.state.currentPage === 1 ? 'disabled' : ''}>
                    Prev
                </button>
                ${this.generatePageButtons(totalPages)}
                <button class="pagination-btn" data-page="next" ${this.state.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;

        footer.appendChild(pagination);

        // Event listeners
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
                buttons += `
                    <button class="pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === current - delta - 1 || i === current + delta + 1) {
                buttons += `<span class="pagination-ellipsis">...</span>`;
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

        // Callback
        if (typeof this.options.onPageChange === 'function') {
            this.options.onPageChange(this.state.currentPage);
        }

        // Dispatch event
        this.container.dispatchEvent(new CustomEvent('antsand:table:pagechanged', {
            detail: { page: this.state.currentPage },
            bubbles: true
        }));
    }

    // =========================================================================
    // RENDERING
    // =========================================================================
    renderRows() {
        const tbody = this.table.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        let rowsToShow = this.state.filteredRows;

        // Apply pagination
        if (this.options.paginate) {
            const start = (this.state.currentPage - 1) * this.options.perPage;
            const end = start + this.options.perPage;
            rowsToShow = rowsToShow.slice(start, end);
        }

        // Empty state
        if (rowsToShow.length === 0) {
            const cols = this.table.querySelectorAll('th').length || 1;
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="${cols}" class="table-empty">
                    No matching records found
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        // Append rows
        rowsToShow.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
        });

        // Update pagination
        if (this.options.paginate) {
            this.renderPagination();
        }
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================
    refresh() {
        const tbody = this.table.querySelector('tbody');
        if (tbody) {
            this.state.originalRows = Array.from(tbody.querySelectorAll('tr'));
            this.state.filteredRows = [...this.state.originalRows];
        }
        this.renderRows();
    }

    destroy() {
        // Remove added elements
        const header = this.container.querySelector('.table-header');
        if (header && header.querySelector('.table-search')) {
            header.querySelector('.table-search').remove();
        }

        const footer = this.container.querySelector('.table-footer');
        if (footer) footer.remove();

        // Remove sortable
        this.table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sortable', 'asc', 'desc');
            th.style.cursor = '';
            th.removeAttribute('aria-sort');
        });

        delete this.container.dataset.tableInit;
    }
}

/**
 * Initialize all tables on the page
 */
function initAllTables() {
    const containers = document.querySelectorAll('[data-table], .ant-table');
    const instances = [];

    containers.forEach(container => {
        if (!container.dataset.tableInit) {
            instances.push(new AntsandTable(container));
        }
    });

    return instances;
}

// Export for ES6 module usage
export { AntsandTable, initAllTables };
export default AntsandTable;
