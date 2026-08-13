// ================= CART MANAGEMENT (localStorage) =================

// Add item to cart
function addToCart(productName, price = 100, vendor = "Local Vendor") {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            vendor: vendor,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(productName + " added to cart!");
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Clear cart
function clearCart() {
    localStorage.removeItem('cart');
}

// Get cart count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Open cart page
function openCart() {
    window.location.href = "customers/cart.html";
}

// ================= PRODUCT FUNCTIONS =================

function viewProduct(productName) {
    // Navigate to product details page
    window.location.href = "p-details.html?product=" + encodeURIComponent(productName);
}

function selectVendor(vendor) {
    alert("Selected Vendor: " + vendor);
}

function addProductToCart() {
    alert("Product added to cart!");
}

function buyNow() {
    window.location.href = "order.html";
}

// ================= FILTER FUNCTIONS =================

function filterProducts() {
    const search = document.getElementById("productSearch")?.value || "";
    const category = document.getElementById("categoryFilter")?.value || "all";
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        let matches = true;
        
        // Check category
        if (category !== "all" && !product.dataset.category?.includes(category)) {
            matches = false;
        }
        
        // Check search term
        const productName = product.querySelector('h3')?.textContent?.toLowerCase() || "";
        if (search && !productName.includes(search.toLowerCase())) {
            matches = false;
        }
        
        product.style.display = matches ? 'block' : 'none';
    });
}

function sortProducts() {
    const sortValue = document.getElementById("sortFilter")?.value;
    // Sort logic to be implemented based on requirements
}

// ================= SEARCH =================

function searchProducts() {

    const search = document.getElementById("searchInput")?.value;

    if (!search || search.trim() === "") {
        alert("Please enter a product name.");
        return;
    }

    // Redirect to products page with search parameter
    window.location.href = "customers/products.html?search=" + encodeURIComponent(search);
}


// ================= NAVIGATION =================

function goToProducts() {
    window.location.href = "customers/products.html";
}


// ================= VENDOR =================

function vendorRegistration() {

    alert("Vendor registration page will open here.");

    // Later:
    // Connect vendor registration form.
}