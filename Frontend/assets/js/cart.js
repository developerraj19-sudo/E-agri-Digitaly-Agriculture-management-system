/**
 * E-AGRI Shopping Cart
 * Client-side cart using localStorage
 */

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartBadge();
    }

    // Load cart from localStorage
    loadCart() {
        const cart = localStorage.getItem('eagri_cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('eagri_cart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        if (!product || !product.product_id) {
            console.error('Invalid product for cart:', product);
            return false;
        }

        const existingItem = this.items.find(item => item.product_id === product.product_id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                product_id: product.product_id,
                product_name: product.product_name,
                price: Number(product.price) || 0,
                unit: product.unit,
                dealer_id: product.dealer_id,
                dealer_name: product.dealer_name,
                quantity: quantity,
                image_url: product.product_image_url || null
            });
        }

        this.saveCart();
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.product_id !== productId);
        this.saveCart();
    }

    // Update quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product_id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Update cart badge
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    }
}

// Global cart instance
window.eagriCart = new ShoppingCart();

// Simple viewCart handler (placeholder UI)
function viewCart() {
    const items = window.eagriCart.items;
    if (!items.length) {
        window.eagri.showNotification('Your cart is empty', 'info');
        return;
    }

    const lines = items.map(item =>
        `${item.product_name} x ${item.quantity} (${window.eagri.formatCurrency(item.price)} / ${item.unit})`
    );
    const message = `Items in cart:\n\n${lines.join('\n')}\n\nTotal: ${window.eagri.formatCurrency(window.eagriCart.getTotal())}`;
    alert(message);
}

// Helper to add from product cards
function addToCart(product) {
    if (window.eagriCart.addItem(product)) {
        window.eagri.showNotification(`${product.product_name} added to cart!`, 'success');
    }
}

