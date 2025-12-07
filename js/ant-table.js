/**
 * ANTSAND Table - ES6 Interactive Table Module
 *
 * Features:
 * - Click-to-sort columns (asc/desc toggle)
 * - Auto-detect data types (string, number, date)
 * - Search/filter functionality
 * - Pagination
 * - Row selection
 *
 * Usage:
 *   <div class="ant-table material" data-ant-table>
 *     <table>...</table>
 *   </div>
 *
 *   // Or initialize manually:
 *   new AntTable(element, options);
 */

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

    init() {
        // Store original row order
        const tbody = this.table.querySelector('tbody');
        if (tbody) {
            this.state.originalRows = Array.from(tbody.querySelectorAll('tr'));
            this.state.filteredRows = [...this.state.originalRows];
        }

        // Initialize features
        if (this.options.sortable) {
            this.initSorting();
        }

        if (this.options.searchable) {
            this.initSearch();
        }

        if (this.options.paginate) {
            this.initPagination();
        }

        // Mark as initialized
        this.container.dataset.antTableInit = 'true';
    }

    // =========================================================================
    // SORTING
    // =========================================================================
    initSorting() {
        const headers = this.table.querySelectorAll('th');

        headers.forEach((th, index) => {
            // Add sortable class if not already present
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

        // Determine sort direction
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

        // Sort rows
        const rows = this.state.filteredRows;
        const sortedRows = this.sortRows(rows, columnIndex, direction);

        // Re-render
        this.state.filteredRows = sortedRows;
        this.renderRows();

        // Callback
        if (typeof this.options.onSort === 'function') {
            this.options.onSort(columnIndex, direction);
        }
    }

    sortRows(rows, columnIndex, direction) {
        return [...rows].sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex];
            const cellB = rowB.cells[columnIndex];

            if (!cellA || !cellB) return 0;

            let valueA = this.getCellValue(cellA);
            let valueB = this.getCellValue(cellB);

            // Detect and compare by type
            const comparison = this.compareValues(valueA, valueB);

            return direction === 'asc' ? comparison : -comparison;
        });
    }

    getCellValue(cell) {
        // Check for data-sort-value attribute first
        if (cell.dataset.sortValue !== undefined) {
            return cell.dataset.sortValue;
        }
        return cell.textContent.trim();
    }

    compareValues(a, b) {
        // Handle nulls/empty
        if (a === '' && b === '') return 0;
        if (a === '') return 1;
        if (b === '') return -1;

        // Try numeric comparison
        const numA = parseFloat(a.replace(/[$,]/g, ''));
        const numB = parseFloat(b.replace(/[$,]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }

        // Try date comparison
        const dateA = new Date(a);
        const dateB = new Date(b);

        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateA.getTime() - dateB.getTime();
        }

        // String comparison (case-insensitive)
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    // =========================================================================
    // SEARCH / FILTER
    // =========================================================================
    initSearch() {
        // Check if search input exists, or create controls
        let searchInput = this.container.querySelector('.ant-table__search input');

        if (!searchInput) {
            // Create search controls
            const controls = document.createElement('div');
            controls.className = 'ant-table__controls';
            controls.innerHTML = `
                <div class="ant-table__search">
                    <input type="text" placeholder="Search...">
                </div>
            `;
            this.container.insertBefore(controls, this.table);
            searchInput = controls.querySelector('input');
        }

        // Add event listener with debounce
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
                const text = row.textContent.toLowerCase();
                return text.includes(this.state.searchQuery);
            });
        }

        // Re-apply sort if active
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
    }

    // =========================================================================
    // PAGINATION
    // =========================================================================
    initPagination() {
        this.renderPagination();
    }

    renderPagination() {
        // Remove existing pagination
        const existingPagination = this.container.querySelector('.ant-table__pagination');
        if (existingPagination) {
            existingPagination.remove();
        }

        const totalRows = this.state.filteredRows.length;
        const totalPages = Math.ceil(totalRows / this.options.perPage);

        if (totalPages <= 1) return;

        const pagination = document.createElement('div');
        pagination.className = 'ant-table__pagination';

        const start = (this.state.currentPage - 1) * this.options.perPage + 1;
        const end = Math.min(this.state.currentPage * this.options.perPage, totalRows);

        pagination.innerHTML = `
            <div class="ant-table__pagination-info">
                Showing ${start} to ${end} of ${totalRows} entries
            </div>
            <div class="ant-table__pagination-buttons">
                <button class="ant-table__pagination-btn" data-page="prev" ${this.state.currentPage === 1 ? 'disabled' : ''}>
                    Prev
                </button>
                ${this.generatePageButtons(totalPages)}
                <button class="ant-table__pagination-btn" data-page="next" ${this.state.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;

        this.container.appendChild(pagination);

        // Add event listeners
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
                    <button class="ant-table__pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === current - delta - 1 || i === current + delta + 1) {
                buttons += `<span style="padding: 0 8px;">...</span>`;
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
    }

    // =========================================================================
    // RENDERING
    // =========================================================================
    renderRows() {
        const tbody = this.table.querySelector('tbody');
        if (!tbody) return;

        // Clear current rows
        tbody.innerHTML = '';

        // Get rows to display
        let rowsToShow = this.state.filteredRows;

        // Apply pagination
        if (this.options.paginate) {
            const start = (this.state.currentPage - 1) * this.options.perPage;
            const end = start + this.options.perPage;
            rowsToShow = rowsToShow.slice(start, end);
        }

        // Show empty state if no rows
        if (rowsToShow.length === 0) {
            const emptyRow = document.createElement('tr');
            const cols = this.table.querySelectorAll('th').length || 1;
            emptyRow.innerHTML = `
                <td colspan="${cols}" style="text-align: center; padding: 40px; color: #64748b;">
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

        // Update pagination if enabled
        if (this.options.paginate) {
            this.renderPagination();
        }
    }

    // =========================================================================
    // PUBLIC METHODS
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
        // Remove added controls
        const controls = this.container.querySelector('.ant-table__controls');
        if (controls) controls.remove();

        const pagination = this.container.querySelector('.ant-table__pagination');
        if (pagination) pagination.remove();

        // Remove sortable indicators
        this.table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sortable', 'asc', 'desc');
            th.style.cursor = '';
        });

        // Remove init flag
        delete this.container.dataset.antTableInit;
    }
}

// =============================================================================
// AUTO-INITIALIZE
// =============================================================================
function initAntTables() {
    document.querySelectorAll('[data-ant-table]:not([data-ant-table-init])').forEach(el => {
        const options = {
            sortable: el.dataset.sortable !== 'false',
            searchable: el.dataset.searchable === 'true',
            paginate: el.dataset.paginate === 'true',
            perPage: parseInt(el.dataset.perPage) || 10
        };
        new AntTable(el, options);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAntTables);
} else {
    initAntTables();
}

// Export for module usage
export { AntTable };
export default AntTable;
