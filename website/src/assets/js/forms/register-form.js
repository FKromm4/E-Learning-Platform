// ============================================
// REGISTER-FORM.JS - Form Validation
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');

    if (!registerForm) return;

    // Form validation rules
    const validators = {
        name: {
            validate: (value) => value.trim().length >= 2,
            message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Παρακαλώ εισάγετε έγκυρο email'
        },
        password: {
            validate: (value) => value.length >= 8,
            message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες'
        },
        confirmPassword: {
            validate: (value) => {
                const password = document.getElementById('password').value;
                return value === password;
            },
            message: 'Οι κωδικοί δεν ταιριάζουν'
        },
        interests: {
            validate: (value) => value !== '',
            message: 'Παρακαλώ επιλέξτε τουλάχιστον ένα ενδιαφέρον'
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

    // Calculate password strength
    function calculatePasswordStrength(password) {
        if (!password) {
            return { strength: 'none', score: 0 };
        }

        let score = 0;

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1; // lowercase
        if (/[A-Z]/.test(password)) score += 1; // uppercase
        if (/[0-9]/.test(password)) score += 1; // numbers
        if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters

        // Determine strength level
        if (score <= 2) {
            return { strength: 'weak', score, text: 'Αδύναμος' };
        } else if (score <= 4) {
            return { strength: 'medium', score, text: 'Μέτριος' };
        } else {
            return { strength: 'strong', score, text: 'Ισχυρός' };
        }
    }

    // Update password strength indicator
    function updatePasswordStrength(password) {
        const strengthFill = document.getElementById('password-strength-fill');
        const strengthText = document.getElementById('password-strength-text');

        if (!strengthFill || !strengthText) return;

        const result = calculatePasswordStrength(password);

        // Remove all strength classes
        strengthFill.classList.remove('weak', 'medium', 'strong');
        strengthText.classList.remove('weak', 'medium', 'strong');

        if (result.strength !== 'none') {
            // Add appropriate strength class
            strengthFill.classList.add(result.strength);
            strengthText.classList.add(result.strength);
            strengthText.textContent = result.text;
        } else {
            strengthText.textContent = '';
        }
    }

    // Add password strength listener
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function () {
            updatePasswordStrength(this.value);
        });
    }

    // Add blur event listeners to all form fields
    const formFields = registerForm.querySelectorAll('.form-input, .form-select');
    formFields.forEach(field => {
        field.addEventListener('blur', function () {
            validateField(this);
        });

        // Also validate on input for password confirmation
        if (field.id === 'confirmPassword') {
            field.addEventListener('input', function () {
                validateField(this);
            });
        }
    });

    // Form submission
    registerForm.addEventListener('submit', async function (e) {
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
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                interests: document.getElementById('interests').value
            };

            try {
                // Use AuthService to register
                const result = await authService.register(formData);

                if (result.success) {
                    // Show success message
                    alert(result.message);
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    // Show error (e.g. email exists)
                    alert(result.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Υπήρξε ένα πρόβλημα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
            }
        } else {
            // Scroll to first error
            const firstError = registerForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
