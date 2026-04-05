const display = document.getElementById('display');
const expressionText = document.getElementById('expression');
const buttonsContainer = document.getElementById('buttons');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history');

let currentInput = '0';
let currentExpression = '';
const history = [];

function updateScreen() {
    display.value = currentInput;
    expressionText.textContent = currentExpression || '0';
}

function renderHistory() {
    historyList.innerHTML = '';

    if (!history.length) {
        historyEmpty.style.display = 'block';
        return;
    }

    historyEmpty.style.display = 'none';

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.expression}</span><strong>${item.result}</strong>`;
        historyList.appendChild(li);
    });
}

function pushHistory(expression, result) {
    history.unshift({ expression, result: String(result) });
    if (history.length > 5) {
        history.pop();
    }
    renderHistory();
}

function canAddOperator(operator) {
    if (!currentInput || currentInput === '-') {
        return false;
    }

    if (!currentExpression) {
        return true;
    }

    const lastChar = currentExpression[currentExpression.length - 1];
    return !['+', '-', '*', '/'].includes(lastChar);
}

function appendNumber(value) {
    if (value === '.' && currentInput.includes('.')) {
        return;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    updateScreen();
}

function addOperator(operator) {
    if (!canAddOperator(operator)) {
        return;
    }

    currentExpression += `${currentInput}${operator}`;
    currentInput = '0';
    updateScreen();
}

function clearAll() {
    currentInput = '0';
    currentExpression = '';
    updateScreen();
}

function deleteLast() {
    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateScreen();
}

function toggleSign() {
    if (currentInput === '0') {
        return;
    }

    currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : `-${currentInput}`;
    updateScreen();
}

function toPercent() {
    const value = Number(currentInput);
    if (Number.isNaN(value)) {
        return;
    }

    currentInput = String(value / 100);
    updateScreen();
}

function safeEvaluate(expression) {
    if (!/^[0-9+\-*/. ]+$/.test(expression)) {
        return { ok: false, message: 'Invalid input' };
    }

    try {
        const result = Function(`"use strict"; return (${expression})`)();
        if (!Number.isFinite(result)) {
            return { ok: false, message: 'Cannot divide by zero' };
        }

        return { ok: true, value: Number(result.toFixed(10)) };
    } catch {
        return { ok: false, message: 'Invalid expression' };
    }
}

function calculateResult() {
    const finalExpression = `${currentExpression}${currentInput}`;
    const evaluated = safeEvaluate(finalExpression);

    if (!evaluated.ok) {
        display.value = evaluated.message;
        expressionText.textContent = finalExpression;
        currentInput = '0';
        currentExpression = '';
        return;
    }

    pushHistory(finalExpression, evaluated.value);
    currentInput = String(evaluated.value);
    currentExpression = '';
    updateScreen();
}

buttonsContainer.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) {
        return;
    }

    const { value, action } = button.dataset;

    if (value) {
        if (['+', '-', '*', '/'].includes(value)) {
            addOperator(value);
        } else {
            appendNumber(value);
        }
        return;
    }

    if (action === 'clear') {
        clearAll();
    } else if (action === 'delete') {
        deleteLast();
    } else if (action === 'equals') {
        calculateResult();
    } else if (action === 'toggle-sign') {
        toggleSign();
    } else if (action === 'percent') {
        toPercent();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    history.length = 0;
    renderHistory();
});

document.addEventListener('keydown', event => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        appendNumber(key);
        return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
        addOperator(key);
        return;
    }

    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearAll();
    }
});

updateScreen();
renderHistory();
