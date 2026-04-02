const form = document.getElementById('signup-form');
const resetBtn = document.getElementById('reset-btn');
const successMessage = document.getElementById('success-message');

const fields = {
    name: {
        input: document.getElementById('name'),
        wrapper: document.getElementById('name-field'),
        error: document.getElementById('name-error')
    },
    email: {
        input: document.getElementById('email'),
        wrapper: document.getElementById('email-field'),
        error: document.getElementById('email-error')
    },
    password: {
        input: document.getElementById('password'),
        wrapper: document.getElementById('password-field'),
        error: document.getElementById('password-error')
    }
};

function showFieldState(field, message) {
    field.error.textContent = message;

    if (message) {
        field.wrapper.classList.add('invalid');
        field.wrapper.classList.remove('valid');
    } else {
        field.wrapper.classList.remove('invalid');
        field.wrapper.classList.add('valid');
    }
}

function clearFieldState(field) {
    field.error.textContent = '';
    field.wrapper.classList.remove('invalid', 'valid');
}

function validateName() {
    const value = fields.name.input.value.trim();

    if (!value) {
        showFieldState(fields.name, 'Name is required.');
        return false;
    }

    if (value.length < 3) {
        showFieldState(fields.name, 'Name must be at least 3 characters long.');
        return false;
    }

    if (!/^[a-zA-Z ]+$/.test(value)) {
        showFieldState(fields.name, 'Name can contain only letters and spaces.');
        return false;
    }

    showFieldState(fields.name, '');
    return true;
}

function validateEmail() {
    const value = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!value) {
        showFieldState(fields.email, 'Email is required.');
        return false;
    }

    if (!emailPattern.test(value)) {
        showFieldState(fields.email, 'Enter a valid email address.');
        return false;
    }

    showFieldState(fields.email, '');
    return true;
}

function validatePassword() {
    const value = fields.password.input.value;

    if (!value) {
        showFieldState(fields.password, 'Password is required.');
        return false;
    }

    if (value.length < 8) {
        showFieldState(fields.password, 'Password must be at least 8 characters.');
        return false;
    }

    if (!/[A-Z]/.test(value)) {
        showFieldState(fields.password, 'Password must include one uppercase letter.');
        return false;
    }

    if (!/[a-z]/.test(value)) {
        showFieldState(fields.password, 'Password must include one lowercase letter.');
        return false;
    }

    if (!/[0-9]/.test(value)) {
        showFieldState(fields.password, 'Password must include one number.');
        return false;
    }

    showFieldState(fields.password, '');
    return true;
}

function clearSuccessMessage() {
    successMessage.textContent = '';
    successMessage.classList.remove('active');
}

fields.name.input.addEventListener('input', () => {
    validateName();
    clearSuccessMessage();
});

fields.email.input.addEventListener('input', () => {
    validateEmail();
    clearSuccessMessage();
});

fields.password.input.addEventListener('input', () => {
    validatePassword();
    clearSuccessMessage();
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
        successMessage.textContent = 'Fix validation errors before submitting.';
        successMessage.classList.remove('active');
        return;
    }

    successMessage.textContent = 'Form submitted successfully.';
    successMessage.classList.add('active');
});

resetBtn.addEventListener('click', () => {
    form.reset();
    Object.values(fields).forEach(clearFieldState);
    clearSuccessMessage();
    fields.name.input.focus();
});