// ============================================
// CART.JS - Shopping Cart Management
// ============================================

// LocalStorage keys
const CART_STORAGE_KEY = 'elearning_cart';
const PURCHASED_STORAGE_KEY = 'elearning_purchased';

// Get cart from localStorage
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Get purchased books from localStorage
function getPurchasedBooks() {
    try {
        const purchased = localStorage.getItem(PURCHASED_STORAGE_KEY);
        return purchased ? JSON.parse(purchased) : [];
    } catch (error) {
        console.error('Error loading purchased books:', error);
        return [];
    }
}

// Save purchased books to localStorage
function savePurchasedBooks(purchased) {
    try {
        localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify(purchased));
    } catch (error) {
        console.error('Error saving purchased books:', error);
    }
}

// Check if a book is already purchased
function isPurchased(bookId) {
    const purchased = getPurchasedBooks();
    // Use String since MongoDB _id is a string
    return purchased.includes(String(bookId));
}

// Check if a book is in the cart
function isInCart(bookId) {
    const cart = getCart();
    // Use String since MongoDB _id is a string
    return cart.some(item => item.id === String(bookId));
}

// Add book to cart
async function addToCart(bookId) {
    // Check if already purchased
    if (isPurchased(bookId)) {
        showNotification('Έχετε ήδη αγοράσει αυτό το βιβλίο', 'info');
        return false;
    }

    // Check if already in cart
    if (isInCart(bookId)) {
        showNotification('Το βιβλίο είναι ήδη στο καλάθι', 'info');
        return false;
    }

    // Fetch book details from API
    const response = await api.get(`/api/books/${bookId}`);
    if (!response.success || !response.data) {
        showNotification('Το βιβλίο δεν βρέθηκε', 'error');
        return false;
    }
    const book = response.data;

    // Add to cart using string ID
    const cart = getCart();
    cart.push({
        id: String(book._id),
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        type: book.type
    });
    saveCart(cart);

    // Update UI
    updateCartBadge();
    renderCartDropdown();
    showNotification('Το βιβλίο προστέθηκε στο καλάθι!', 'success');

    return true;
}

// Remove book from cart
function removeFromCart(bookId) {
    let cart = getCart();
    // Use String since MongoDB _id is a string
    cart = cart.filter(item => item.id !== String(bookId));
    saveCart(cart);

    // Update UI
    updateCartBadge();
    renderCartDropdown();

    // If on course-details page, re-enable the Buy Now button
    const buyBtn = document.getElementById('buy-now-btn');
    if (buyBtn && buyBtn.getAttribute('data-book-id') === String(bookId)) {
        buyBtn.textContent = 'Αγορά τώρα';
        buyBtn.disabled = false;
    }

    showNotification('Το βιβλίο αφαιρέθηκε από το καλάθι', 'info');
}

// Mark books as purchased (checkout)
function checkout() {
    const cart = getCart();

    if (cart.length === 0) {
        showNotification('Το καλάθι είναι άδειο', 'warning');
        return;
    }

    // Move cart items to purchased
    const purchased = getPurchasedBooks();
    const newPurchases = cart.map(item => item.id);
    const updatedPurchased = [...new Set([...purchased, ...newPurchases])];

    savePurchasedBooks(updatedPurchased);

    // Clear cart
    saveCart([]);

    // Update UI
    updateCartBadge();
    renderCartDropdown();

    // Show success message
    showNotification(`Αγορά ολοκληρώθηκε! ${cart.length} βιβλίο/α αγοράστηκαν.`, 'success');

    // Refresh book cards if on books page
    if (document.getElementById('books-list')) {
        const currentBooks = getAllBooks();
        renderBooks(currentBooks, document.getElementById('books-list'));
    }

    // If on course-details page, update the Buy Now button to show purchased
    const buyBtn = document.getElementById('buy-now-btn');
    if (buyBtn) {
        const ctaContainer = document.getElementById('cta-buttons');
        if (ctaContainer) {
            ctaContainer.innerHTML = `
                <div class="already-bought-badge" style="flex: 1; text-align: center; padding: var(--space-4);">✓ Έχει αγοραστεί</div>
                <button class="btn btn-secondary" style="flex: 1; min-width: 200px;" onclick="handleAddToFavorites(event)">
                    Προσθήκη στα αγαπημένα
                </button>
            `;
        }
    }
}

// Update cart badge count
function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cart-badge');

    if (!badge) return;

    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.hidden = false;
    } else {
        badge.textContent = '';
        badge.hidden = true;
    }
}

// Render cart dropdown content
function renderCartDropdown() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Το καλάθι σας είναι άδειο</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-book-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price}</div>
            </div>
            <button class="cart-remove-btn" data-book-id="${item.id}" aria-label="Αφαίρεση">
                ✕
            </button>
        </div>
    `).join('');

    // Add event listeners to remove buttons
    container.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = btn.getAttribute('data-book-id');
            removeFromCart(bookId);
        });
    });
}

// Initialize cart functionality
function initCart() {
    // Check if user is authenticated
    const cartDropdownContainer = document.querySelector('.cart-dropdown');

    if (cartDropdownContainer) {
        // Check if authService exists and user is authenticated
        const isAuthenticated = typeof authService !== 'undefined' && authService.isAuthenticated();

        if (!isAuthenticated) {
            // Hide cart for non-authenticated users
            cartDropdownContainer.style.display = 'none';
            return;
        } else {
            // Show cart for authenticated users
            cartDropdownContainer.style.display = 'inline-block';
        }
    }

    // Update badge on page load
    updateCartBadge();

    // Render cart dropdown
    renderCartDropdown();

    // Cart icon toggle
    const cartBtn = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown-menu');

    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = cartBtn.getAttribute('aria-expanded') === 'true';
            cartBtn.setAttribute('aria-expanded', !isExpanded);
            cartDropdown.hidden = isExpanded;
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartBtn.setAttribute('aria-expanded', 'false');
                cartDropdown.hidden = true;
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkout();
        });
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}
