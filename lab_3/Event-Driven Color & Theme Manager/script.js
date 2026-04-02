const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const buttonColorInput = document.getElementById('button-color');
const applyBtn = document.getElementById('apply-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status');
const themeObjectEl = document.getElementById('theme-object');

const defaultTheme = {
    backgroundColor: '#f4f7fb',
    textColor: '#16324f',
    buttonColor: '#2563eb'
};

const selectedTheme = { ...defaultTheme };

function renderThemeObject() {
    themeObjectEl.textContent = JSON.stringify(selectedTheme, null, 2);
}

function updateInputValues() {
    bgColorInput.value = selectedTheme.backgroundColor;
    textColorInput.value = selectedTheme.textColor;
    buttonColorInput.value = selectedTheme.buttonColor;
}

function applyTheme(theme) {
    document.documentElement.style.setProperty('--page-bg', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--button-color', theme.buttonColor);
}

function readThemeFromInputs() {
    selectedTheme.backgroundColor = bgColorInput.value;
    selectedTheme.textColor = textColorInput.value;
    selectedTheme.buttonColor = buttonColorInput.value;
}

applyBtn.addEventListener('click', () => {
    readThemeFromInputs();
    applyTheme(selectedTheme);
    renderThemeObject();
    statusText.textContent = 'Theme applied successfully.';
});

resetBtn.addEventListener('click', () => {
    Object.assign(selectedTheme, defaultTheme);
    updateInputValues();
    applyTheme(selectedTheme);
    renderThemeObject();
    statusText.textContent = 'Default theme restored.';
});

updateInputValues();
applyTheme(selectedTheme);
renderThemeObject();