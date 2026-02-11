/**
 * Dealer Dashboard JavaScript
 * Product management and order handling
 */

document.addEventListener('DOMContentLoaded', function() {
    const user = eagri.checkAuth();
    
    if (user.role !== 'dealer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load user data
    document.getElementById('userName').textContent = user.full_name;
    document.getElementById('dealerName').textContent = user.full_name.split(' ')[0];
    
    // Check verification status
    checkVerificationStatus(user.role_data);
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup form handlers
    setupFormHandlers();
});

function checkVerificationStatus(dealerData) {
    const verificationAlert = document.getElementById('verificationAlert');
    const statusText = document.getElementById('verificationStatus');
    
    if (dealerData && dealerData.verification_status === 'pending') {
        verificationAlert.className = 'alert alert-warning';
        verificationAlert.innerHTML = `
            <i class="fas fa-clock"></i>
            <strong>Pending Verification:</strong> Your dealer account is awaiting admin approval. 
            You can add products once verified.
        `;
        verificationAlert.style.display = 'block';
        statusText.textContent = 'Pending Verification';
    } else if (dealerData && dealerData.verification_status === 'verified') {
        verificationAlert.className = 'alert alert-success';
        verificationAlert.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Verified Dealer:</strong> Your account is verified and active.
        `;
        verificationAlert.style.display = 'block';
        statusText.textContent = 'Verified Dealer';
    } else if (dealerData && dealerData.verification_status === 'rejected') {
        verificationAlert.className = 'alert alert-error';
        verificationAlert.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <strong>Verification Rejected:</strong> Please contact admin for more information.
        `;
        verificationAlert.style.display = 'block';
        statusText.textContent = 'Verification Rejected';
    }
}

async function loadDashboardData() {
    try {
        // Load products
        const products = await loadDealerProducts();
        updateDashboardStats(products);
        
        // Load orders
        await loadDealerOrders();
        
        // Load top products
        displayTopProducts(products);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadDealerProducts() {
    try {
        const result = await eagri.apiCall('products.php?action=dealer-products');
        
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

function updateDashboardStats(products) {
    // Total products
    document.getElementById('totalProducts').textContent = products.length;
    
    // Calculate total stock value
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
    document.getElementById('totalRevenue').textContent = eagri.formatCurrency(totalValue);
}

function displayTopProducts(products) {
    const grid = document.getElementById('topProductsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p class="text-center">No products added yet</p>';
        return;
    }
    
    // Display first 3 products
    const topProducts = products.slice(0, 3);
    
    grid.innerHTML = topProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.product_image_url ? 
                    `<img src="${product.product_image_url}" alt="${product.product_name}">` :
                    '<i class="fas fa-box"></i>'
                }
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.product_name}</h3>
                <div class="product-price">${eagri.formatCurrency(product.price)}/${product.unit}</div>
                <div class="product-stock">Stock: ${product.stock_quantity} ${product.unit}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="editProduct(${product.product_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="viewProduct(${product.product_id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadDealerOrders() {
    const table = document.getElementById('recentOrdersTable');
    
    // Sample data for now
    table.innerHTML = `
        <tr>
            <td>#ORD001</td>
            <td>Organic Fertilizer</td>
            <td>Rajesh Kumar</td>
            <td>50 kg</td>
            <td>₹2,500</td>
            <td><span class="dealer-status status-pending">Pending</span></td>
            <td>${eagri.formatDate(new Date())}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="confirmOrder('ORD001')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        </tr>
    `;
}

function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
}

function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to selected menu item
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Load section-specific data
    if (sectionId === 'products') {
        loadMyProducts();
    } else if (sectionId === 'orders') {
        loadAllOrders();
    } else if (sectionId === 'inventory') {
        loadInventory();
    }
}

async function loadMyProducts() {
    const grid = document.getElementById('myProductsGrid');
    grid.innerHTML = '<p class="text-center">Loading products...</p>';
    
    const products = await loadDealerProducts();
    
    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                <h3>No products yet</h3>
                <p>Start by adding your first product</p>
                <button class="btn btn-primary" onclick="switchSection('add-product')">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>
        `;
        return;
    }
    
    displayTopProducts(products);
}

function setupFormHandlers() {
    // Add Product Form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    
    const btn = document.getElementById('addProductBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    const formData = {
        product_name: document.getElementById('productName').value.trim(),
        category_id: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        stock_quantity: parseFloat(document.getElementById('productStock').value),
        min_order_quantity: parseFloat(document.getElementById('productMinOrder').value),
        is_organic: document.getElementById('isOrganic').checked,
        product_image_url: '' // Will be handled separately with file upload
    };
    
    try {
        const result = await eagri.apiCall('products.php?action=create', 'POST', formData);
        
        if (result.success) {
            eagri.showNotification('Product added successfully!', 'success');
            document.getElementById('addProductForm').reset();
            switchSection('products');
        } else {
            eagri.showNotification(result.message || 'Failed to add product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        eagri.showNotification('An error occurred. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function toggleUserMenu() {
    document.getElementById('userMenu').classList.toggle('show');
}

function searchProducts() {
    // Implementation for product search
    console.log('Searching products...');
}

function filterProducts() {
    // Implementation for product filtering
    console.log('Filtering products...');
}

function filterOrders() {
    // Implementation for order filtering
    console.log('Filtering orders...');
}

function loadAllOrders() {
    console.log('Loading all orders...');
}

function loadInventory() {
    console.log('Loading inventory...');
}

function loadAnalytics() {
    console.log('Loading analytics...');
}

function editProduct(productId) {
    console.log('Editing product:', productId);
    eagri.showNotification('Edit functionality coming soon', 'info');
}

function viewProduct(productId) {
    console.log('Viewing product:', productId);
    eagri.showNotification('View functionality coming soon', 'info');
}

function confirmOrder(orderId) {
    console.log('Confirming order:', orderId);
    eagri.showNotification('Order confirmed!', 'success');
}

function showProfile() {
    eagri.showNotification('Profile page coming soon', 'info');
}

function showSettings() {
    eagri.showNotification('Settings page coming soon', 'info');
}

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    if (!e.target.matches('.user-info') && !e.target.closest('.user-info')) {
        const dropdown = document.getElementById('userMenu');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
});
