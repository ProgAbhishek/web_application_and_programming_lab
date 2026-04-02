const products = [
    { id: 1, name: 'Wireless Mouse', price: 24.99, category: 'Accessories' },
    { id: 2, name: 'Mechanical Keyboard', price: 69.5, category: 'Accessories' },
    { id: 3, name: 'USB-C Hub', price: 39.0, category: 'Connectivity' },
    { id: 4, name: 'Laptop Stand', price: 31.25, category: 'Workspace' },
    { id: 5, name: 'Noise Isolating Earbuds', price: 45.75, category: 'Audio' },
    { id: 6, name: 'Webcam HD', price: 54.2, category: 'Video' }
];

const cart = [];

const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const grandTotalEl = document.getElementById('grand-total');
const heroTotal = document.getElementById('hero-total');

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function getCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5 : 0;
    return {
        subtotal,
        shipping,
        total: subtotal + shipping
    };
}

function renderProducts() {
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <strong>${formatCurrency(product.price)}</strong>
            <button type="button" class="add-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productsGrid.appendChild(card);
    });
}

function updateSummary() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totals = getCartTotals();

    cartCount.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
    subtotalEl.textContent = formatCurrency(totals.subtotal);
    shippingEl.textContent = formatCurrency(totals.shipping);
    grandTotalEl.textContent = formatCurrency(totals.total);
    heroTotal.textContent = formatCurrency(totals.total);
}

function renderCart() {
    if (!cart.length) {
        cartItems.innerHTML = '<p class="empty-state">Cart is empty. Add products to begin.</p>';
        updateSummary();
        return;
    }

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="item-head">
                <h4>${item.name}</h4>
                <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
            <div class="item-controls">
                <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                <span class="qty">${item.quantity}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItems.appendChild(row);
    });

    updateSummary();
}

function addToCart(productId) {
    const product = products.find(entry => entry.id === productId);
    if (!product) {
        return;
    }

    const existing = cart.find(entry => entry.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function removeFromCart(productId) {
    const index = cart.findIndex(entry => entry.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    renderCart();
}

function changeQuantity(productId, action) {
    const item = cart.find(entry => entry.id === productId);
    if (!item) {
        return;
    }

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
    }

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}

productsGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    addToCart(productId);
});

cartItems.addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === 'remove') {
        removeFromCart(productId);
        return;
    }

    changeQuantity(productId, action);
});

renderProducts();
renderCart();