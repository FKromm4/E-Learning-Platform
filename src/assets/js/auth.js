/**
 * AUTH.JS - Authentication Service
 * Handles user registration, login, and session management using localStorage.
 * Uses SHA-256 for password hashing and random salts.
 */

class AuthService {
    constructor() {
        this.usersKey = 'elearning_users';
        this.currentUserKey = 'elearning_current_user';
        this.rememberMeKey = 'elearning_remember_me';
    }

    /**
     * Generate a random salt
     * @returns {string} Hex string of salt
     */
    generateSalt() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Hash password with salt using SHA-256
     * @param {string} password 
     * @param {string} salt 
     * @returns {Promise<string>} Hex string of hash
     */
    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get all registered users
     * @returns {Object} Map of email -> user object
     */
    getUsers() {
        const usersJson = localStorage.getItem(this.usersKey);
        return usersJson ? JSON.parse(usersJson) : {};
    }

    /**
     * Save users to localStorage
     * @param {Object} users 
     */
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    /**
     * Register a new user
     * @param {Object} userData { name, email, password, interests }
     * @returns {Promise<Object>} Result { success, message }
     */
    async register(userData) {
        const users = this.getUsers();

        if (users[userData.email]) {
            return { success: false, message: 'Το email χρησιμοποιείται ήδη.' };
        }

        const salt = this.generateSalt();
        const hashedPassword = await this.hashPassword(userData.password, salt);

        const newUser = {
            name: userData.name,
            email: userData.email,
            interests: userData.interests,
            salt: salt,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users[userData.email] = newUser;
        this.saveUsers(users);

        return { success: true, message: 'Η εγγραφή ολοκληρώθηκε επιτυχώς! Παρακαλώ συνδεθείτε.' };
    }

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe Whether to persist login across browser sessions
     * @returns {Promise<Object>} Result { success, message, user }
     */
    async login(email, password, rememberMe = false) {
        const users = this.getUsers();
        const user = users[email];

        if (!user) {
            return { success: false, message: 'Λάθος email ή κωδικός.' };
        }

        const hashedPassword = await this.hashPassword(password, user.salt);

        if (hashedPassword === user.passwordHash) {
            const sessionUser = {
                name: user.name,
                email: user.email,
                interests: user.interests
            };
            this.setCurrentUser(sessionUser, rememberMe);
            return { success: true, user: sessionUser };
        } else {
            return { success: false, message: 'Λάθος email ή κωδικός.' };
        }
    }

    /**
     * Change user password
     * @param {string} email 
     * @param {string} currentPassword 
     * @param {string} newPassword 
     * @returns {Promise<Object>} Result { success, message }
     */
    async changePassword(email, currentPassword, newPassword) {
        const users = this.getUsers();
        const user = users[email];

        if (!user) {
            return { success: false, message: 'Ο χρήστης δεν βρέθηκε.' };
        }

        const currentPasswordHash = await this.hashPassword(currentPassword, user.salt);

        if (currentPasswordHash !== user.passwordHash) {
            return { success: false, message: 'Ο τρέχων κωδικός είναι λάθος.' };
        }

        const newSalt = this.generateSalt();
        const newPasswordHash = await this.hashPassword(newPassword, newSalt);

        user.salt = newSalt;
        user.passwordHash = newPasswordHash;

        users[email] = user;
        this.saveUsers(users);

        return { success: true, message: 'Ο κωδικός άλλαξε επιτυχώς!' };
    }

    /**
     * Set current logged in user
     * @param {Object} user 
     * @param {boolean} rememberMe Whether to use localStorage (persistent) or sessionStorage (session-only)
     */
    setCurrentUser(user, rememberMe = false) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.currentUserKey, JSON.stringify(user));
        // Store the preference so we know where to look
        localStorage.setItem(this.rememberMeKey, rememberMe.toString());
    }

    /**
     * Get current logged in user
     * Checks both localStorage and sessionStorage
     * @returns {Object|null}
     */
    getCurrentUser() {
        // Check sessionStorage first (current session)
        let userJson = sessionStorage.getItem(this.currentUserKey);
        if (userJson) {
            return JSON.parse(userJson);
        }

        // Check localStorage (persistent login)
        userJson = localStorage.getItem(this.currentUserKey);
        if (userJson) {
            return JSON.parse(userJson);
        }

        return null;
    }

    /**
     * Logout user
     * Clears both localStorage and sessionStorage
     */
    logout() {
        localStorage.removeItem(this.currentUserKey);
        sessionStorage.removeItem(this.currentUserKey);
        localStorage.removeItem(this.rememberMeKey);
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

// Export singleton instance
const authService = new AuthService();
