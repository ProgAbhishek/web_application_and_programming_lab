const tableForm = document.getElementById('table-form');
const rowsInput = document.getElementById('rows-input');
const colsInput = document.getElementById('cols-input');
const addRowBtn = document.getElementById('add-row-btn');
const deleteRowBtn = document.getElementById('delete-row-btn');
const highlightBtn = document.getElementById('highlight-btn');
const tableWrap = document.getElementById('table-wrap');
const statusText = document.getElementById('status');

let currentRows = 0;
let currentCols = 0;
let highlightEnabled = false;

function showStatus(message) {
    statusText.textContent = message;
}

function createTable(rows, cols) {
    const table = document.createElement('table');
    const body = document.createElement('tbody');

    for (let row = 0; row < rows; row += 1) {
        const tr = document.createElement('tr');

        for (let col = 0; col < cols; col += 1) {
            const td = document.createElement('td');
            td.textContent = `R${row + 1}C${col + 1}`;
            tr.appendChild(td);
        }

        body.appendChild(tr);
    }

    table.appendChild(body);
    return table;
}

function getTableBody() {
    const table = tableWrap.querySelector('table');
    if (!table) {
        return null;
    }
    return table.querySelector('tbody');
}

function applyEvenHighlight() {
    const body = getTableBody();
    if (!body) {
        return;
    }

    const rows = body.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.classList.remove('even-highlight');
        if (highlightEnabled && (index + 1) % 2 === 0) {
            row.classList.add('even-highlight');
        }
    });
}

function generateTable(rows, cols) {
    const table = createTable(rows, cols);
    tableWrap.innerHTML = '';
    tableWrap.appendChild(table);

    currentRows = rows;
    currentCols = cols;
    highlightEnabled = false;
    applyEvenHighlight();
    highlightBtn.textContent = 'Highlight Even Rows';
    showStatus(`Generated table with ${rows} row(s) and ${cols} column(s).`);
}

function addRow() {
    const body = getTableBody();
    if (!body) {
        showStatus('Generate a table first.');
        return;
    }

    const tr = document.createElement('tr');
    for (let col = 0; col < currentCols; col += 1) {
        const td = document.createElement('td');
        td.textContent = `R${currentRows + 1}C${col + 1}`;
        tr.appendChild(td);
    }

    body.appendChild(tr);
    currentRows += 1;
    applyEvenHighlight();
    showStatus(`Row added. Total rows: ${currentRows}.`);
}

function deleteRow() {
    const body = getTableBody();
    if (!body) {
        showStatus('Generate a table first.');
        return;
    }

    if (currentRows <= 1) {
        showStatus('Cannot delete row. At least one row must remain.');
        return;
    }

    body.removeChild(body.lastElementChild);
    currentRows -= 1;
    applyEvenHighlight();
    showStatus(`Last row removed. Total rows: ${currentRows}.`);
}

tableForm.addEventListener('submit', event => {
    event.preventDefault();

    const rows = Number(rowsInput.value);
    const cols = Number(colsInput.value);

    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) {
        showStatus('Enter valid positive numbers for rows and columns.');
        return;
    }

    generateTable(rows, cols);
});

addRowBtn.addEventListener('click', addRow);
deleteRowBtn.addEventListener('click', deleteRow);

highlightBtn.addEventListener('click', () => {
    const body = getTableBody();
    if (!body) {
        showStatus('Generate a table first.');
        return;
    }

    highlightEnabled = !highlightEnabled;
    applyEvenHighlight();

    if (highlightEnabled) {
        highlightBtn.textContent = 'Clear Highlight';
        showStatus('Even rows are highlighted.');
    } else {
        highlightBtn.textContent = 'Highlight Even Rows';
        showStatus('Even row highlight removed.');
    }
});