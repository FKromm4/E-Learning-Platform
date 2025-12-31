// ============================================
// MENU.JS - Mobile Navigation Toggle
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            // Toggle active class
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInside = mainNav.contains(event.target) || menuToggle.contains(event.target);

            if (!isClickInside && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function () {
            if (window.innerWidth > 767 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
