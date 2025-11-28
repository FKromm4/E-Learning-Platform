/**
 * AUTH-CHECK.JS - Global Authentication Check
 * Runs on all pages to update UI based on authentication status
 */

document.addEventListener('DOMContentLoaded', function () {
    // Wait for authService to be available
    if (typeof authService === 'undefined') {
        console.warn('AuthService not loaded - authentication check skipped');
        return;
    }

    updateAuthUI();
});

/**
 * Update the UI based on authentication status
 */
function updateAuthUI() {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    // Update navigation header
    updateNavigation(isAuthenticated, user);

    // Update protected content if needed
    updateProtectedContent(isAuthenticated);
}

/**
 * Update navigation to show login/user dropdown
 */
function updateNavigation(isAuthenticated, user) {
    const navList = document.querySelector('.main-nav ul');
    if (!navList) return;

    // Find the last li element (where auth controls live)
    let authListItem = navList.querySelector('li:last-child');
    if (!authListItem) return;

    if (isAuthenticated && user) {
        // User is logged in - show user icon dropdown
        authListItem.innerHTML = `
            <div class="user-dropdown">
                <button class="user-icon-btn" aria-label="Μενού χρήστη" aria-expanded="false">
                    <span class="user-icon">👤</span>
                </button>
                <div class="user-dropdown-menu" hidden>
                    <a href="#" class="user-dropdown-item" data-action="account">
                        <span class="dropdown-icon">👤</span>
                        <span>Λεπτομέρειες λογαριασμού</span>
                    </a>
                    <a href="#" class="user-dropdown-item" data-action="bought">
                        <span class="dropdown-icon">🛒</span>
                        <span>Καλάθι</span>
                    </a>
                    <a href="#" class="user-dropdown-item" data-action="favorite">
                        <span class="dropdown-icon">⭐</span>
                        <span>Αγαπημένα</span>
                    </a>
                    <hr class="user-dropdown-divider">
                    <a href="#" class="user-dropdown-item" data-action="signout">
                        <span class="dropdown-icon">🚪</span>
                        <span>Αποσύνδεση</span>
                    </a>
                </div>
            </div>
        `;

        // Setup dropdown functionality
        setupUserDropdown();
    } else {
        // User is not logged in - show login/sign in button
        authListItem.innerHTML = `
            <a href="login.html" class="btn btn-primary">Σύνδεση</a>
        `;
    }
}

/**
 * Setup user dropdown menu functionality
 */
function setupUserDropdown() {
    const dropdownBtn = document.querySelector('.user-icon-btn');
    const dropdownMenu = document.querySelector('.user-dropdown-menu');

    if (!dropdownBtn || !dropdownMenu) return;

    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.hidden = isExpanded;
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.user-dropdown')) {
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownMenu.hidden = true;
        }
    });

    // Handle menu item clicks
    const menuItems = dropdownMenu.querySelectorAll('.user-dropdown-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');

            // Close dropdown
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownMenu.hidden = true;

            // Handle the action
            handleUserMenuAction(action);
        });
    });
}

/**
 * Handle user menu actions
 */
function handleUserMenuAction(action) {
    switch (action) {
        case 'account':
            // Navigate to account details page
            window.location.href = 'account.html';
            break;
        case 'bought':
            // TODO: Navigate to cart page
            showNotification('Καλάθι (σύντομα)', 'info');
            break;
        case 'favorite':
            // TODO: Navigate to favorites page
            showNotification('Αγαπημένα (σύντομα)', 'info');
            break;
        case 'signout':
            handleLogout();
            break;
    }
}

/**
 * Update protected content based on authentication
 */
function updateProtectedContent(isAuthenticated) {
    // For course details page, replace CTA buttons if not authenticated
    if (document.body.getAttribute('data-page') === 'course-details' && !isAuthenticated) {
        const checkContainer = setInterval(() => {
            const ctaButtons = document.querySelector('.course-cta-buttons');
            if (ctaButtons) {
                clearInterval(checkContainer);
                // Replace existing buttons with "Sign in / Sign Up"
                ctaButtons.innerHTML = `
                    <a href="login.html" class="btn btn-primary" style="width: 100%; text-align: center;">
                        Σύνδεση / Εγγραφή
                    </a>
                `;
            }
        }, 100);

        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkContainer), 5000);
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    console.log('Logout initiated');

    // Logout immediately without confirmation for now
    try {
        authService.logout();
        console.log('Logout successful, storage cleared');

        // Force reload to update UI
        window.location.reload(true);
    } catch (error) {
        console.error('Logout error:', error);
        alert('Σφάλμα αποσύνδεσης: ' + error.message);
    }
}
