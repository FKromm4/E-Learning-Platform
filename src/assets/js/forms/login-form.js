// ============================================
// LOGIN-FORM.JS - Login Form Validation
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    // Form validation rules
    const validators = {
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Παρακαλώ εισάγετε έγκυρο email'
        },
        password: {
            validate: (value) => value.length >= 1,
            message: 'Παρακαλώ εισάγετε τον κωδικό σας'
        }
    };

    // Validate single field
    function validateField(field) {
        const fieldName = field.id;
        const value = field.value;
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');

        if (validators[fieldName]) {
            const isValid = validators[fieldName].validate(value);

            if (isValid) {
                formGroup.classList.remove('error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
                return true;
            } else {
                formGroup.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = validators[fieldName].message;
                }
                return false;
            }
        }

        return true;
    }

    // Password visibility toggle
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function () {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);

            // Update button text/icon
            this.textContent = type === 'password' ? '👁️' : '🙈';
            this.setAttribute('aria-label', type === 'password' ? 'Εμφάνιση κωδικού' : 'Απόκρυψη κωδικού');
        });
    }

    // Add blur event listeners to form fields
    const formFields = loginForm.querySelectorAll('.form-input');
    formFields.forEach(field => {
        field.addEventListener('blur', function () {
            validateField(this);
        });
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isFormValid = true;

        // Validate all fields
        formFields.forEach(field => {
            const isFieldValid = validateField(field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            try {
                // Use AuthService to login
                const result = await authService.login(email, password, rememberMe);

                if (result.success) {
                    // Show success message
                    showNotification('Σύνδεση επιτυχής! Θα ανακατευθυνθείτε στην αρχική σελίδα.', 'success');
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    // Show error
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Υπήρξε ένα πρόβλημα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.', 'error');
            }
        } else {
            // Scroll to first error
            const firstError = loginForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
