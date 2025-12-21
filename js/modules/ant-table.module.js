/**
 * ANTSAND Table Module - ES6 Interactive Table Component
 *
 * Features:
 * - Click-to-sort columns (asc/desc toggle)
 * - Auto-detect data types (string, number, date)
 * - Search/filter functionality
 * - Pagination
 *
 * Usage:
 *   <div class="ant-table" data-ant-table data-sortable="true" data-searchable="true">
 *     <table>...</table>
 *   </div>
 */

export class AntTable {
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

// Auto-init function
export function initAntTables() {
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

export default AntTable;
