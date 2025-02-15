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
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateUI();
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
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId, subcategory);
            } else {
                this.saveCart();
                this.updateUI();
            }
        }
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
                                <button onclick="cart.updateQuantity('${item.id}', '${item.subcategory}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="cart.updateQuantity('${item.id}', '${item.subcategory}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="cart-total">
                        <strong>Total:</strong> ₹${this.getTotal()}
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-primary" onclick="window.location.href='checkout.html'">Checkout</button>
                        <button class="btn btn-secondary" onclick="cart.clearCart()">Clear Cart</button>
                    </div>
                `;
            }
        }
    }
}

// Initialize cart
const cart = new Cart();
