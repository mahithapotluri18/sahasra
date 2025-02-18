class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('sahasra_cart') || '[]');
        this.updateUI();
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            item.subcategory === product.subcategory
        );

        if (existingItem) {
            if (this.checkStock(product.id, existingItem.quantity + 1)) {
                existingItem.quantity += 1;
            } else {
                this.showStockWarning();
                return false;
            }
        } else {
            if (this.checkStock(product.id, 1)) {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            } else {
                this.showStockWarning();
                return false;
            }
        }

        this.saveCart();
        this.updateUI();
        return true;
    }

    removeItem(productId, subcategory) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.subcategory === subcategory)
        );
        this.saveCart();
        this.updateUI();
    }

    updateQuantity(productId, subcategory, quantity) {
        const item = this.items.find(item => 
            item.id === productId && 
            item.subcategory === subcategory
        );
        
        if (item) {
            const newQuantity = parseInt(quantity);
            if (isNaN(newQuantity) || newQuantity < 0) {
                this.showError('Please enter a valid quantity');
                return false;
            }

            if (newQuantity === 0) {
                this.removeItem(productId, subcategory);
                return true;
            }

            if (this.checkStock(productId, newQuantity)) {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateUI();
                return true;
            } else {
                this.showStockWarning();
                return false;
            }
        }
        return false;
    }

    checkStock(productId, requestedQuantity) {
        // This would typically make an API call to check stock
        // For now, we'll simulate a stock limit of 10 items
        const stockLimit = 10;
        return requestedQuantity <= stockLimit;
    }

    showStockWarning() {
        const event = new CustomEvent('showToast', {
            detail: {
                message: 'Stock is nil.',
                type: 'error'
            }
        });
        document.dispatchEvent(event);
    }

    showError(message) {
        const event = new CustomEvent('showToast', {
            detail: {
                message: message,
                type: 'error'
            }
        });
        document.dispatchEvent(event);
    }

    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateUI();
    }

    saveCart() {
        localStorage.setItem('sahasra_cart', JSON.stringify(this.items));
    }

    updateUI() {
        // Update cart count in header
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
            cartCount.style.display = this.getItemCount() > 0 ? 'block' : 'none';
        }

        // Update cart dropdown if it exists
        const cartDropdown = document.getElementById('cartDropdown');
        if (cartDropdown) {
            if (this.items.length === 0) {
                cartDropdown.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            } else {
                cartDropdown.innerHTML = `
                    ${this.items.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4>${item.title}</h4>
                                <p>₹${item.price} × ${item.quantity}</p>
                            </div>
                            <div class="cart-item-actions">
                                <button onclick="cart.updateQuantity('${item.id}', '${item.subcategory}', ${item.quantity - 1})" class="quantity-btn">-</button>
                                <input type="number" value="${item.quantity}" 
                                    min="0" max="10" 
                                    onchange="cart.updateQuantity('${item.id}', '${item.subcategory}', this.value)"
                                    class="quantity-input">
                                <button onclick="cart.updateQuantity('${item.id}', '${item.subcategory}', ${item.quantity + 1})" class="quantity-btn">+</button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="cart-total">
                        <strong>Total:</strong> ₹${this.getTotal()}
                    </div>
                    <button onclick="cart.clearCart()" class="clear-cart-btn">Clear Cart</button>
                `;
            }
        }
    }
}

// Initialize cart
const cart = new Cart();

// Listen for toast events
document.addEventListener('showToast', (event) => {
    if (typeof showToast === 'function') {
        showToast(event.detail.message, event.detail.type);
    }
});
