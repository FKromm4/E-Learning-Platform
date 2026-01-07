/**
 * AUTH.JS - Authentication Service
 * Handles user registration, login, and session management via backend API.
 */

class AuthService {
    constructor() {
        this.currentUserKey = 'elearning_current_user';
        this.rememberMeKey = 'elearning_remember_me';
    }

    /**
     * Register a new user
     * @param {Object} userData { name, email, password, interests }
     * @returns {Promise<Object>} Result { success, message, data }
     */
    async register(userData) {
        const response = await api.post('/api/auth/register', userData);

        if (response.success && response.data) {
            // Store token and user data
            api.setToken(response.data.token, true);
            this.setCurrentUser(response.data.user, true);
        }

        return response;
    }

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe Whether to persist login across browser sessions
     * @returns {Promise<Object>} Result { success, message, data }
     */
    async login(email, password, rememberMe = false) {
        const response = await api.post('/api/auth/login', { email, password });

        if (response.success && response.data) {
            // Store token and user data
            api.setToken(response.data.token, rememberMe);
            this.setCurrentUser(response.data.user, rememberMe);
        }

        return response;
    }

    /**
     * Change user password
     * @param {string} currentPassword 
     * @param {string} newPassword 
     * @returns {Promise<Object>} Result { success, message }
     */
    async changePassword(currentPassword, newPassword) {
        return await api.put('/api/user/password', {
            currentPassword,
            newPassword
        }, true);
    }

    /**
     * Validate current token with the server
     * @returns {Promise<Object|null>} User data if valid, null if invalid
     */
    async validateToken() {
        if (!api.hasToken()) {
            return null;
        }

        const response = await api.get('/api/auth/me', true);

        if (response.success && response.data) {
            // Update stored user data
            const rememberMe = localStorage.getItem(this.rememberMeKey) === 'true';
            this.setCurrentUser(response.data.user, rememberMe);
            return response.data.user;
        }

        // Token is invalid - clear everything
        this.logout();
        return null;
    }

    /**
     * Set current logged in user
     * @param {Object} user 
     * @param {boolean} rememberMe Whether to use localStorage (persistent) or sessionStorage (session-only)
     */
    setCurrentUser(user, rememberMe = false) {
        const storage = rememberMe ? localStorage : sessionStorage;
        // Clear from both storages first
        localStorage.removeItem(this.currentUserKey);
        sessionStorage.removeItem(this.currentUserKey);
        // Store in appropriate storage
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
     * Clears token and user data from all storages
     */
    logout() {
        // Clear token
        api.clearToken();
        // Clear user data
        localStorage.removeItem(this.currentUserKey);
        sessionStorage.removeItem(this.currentUserKey);
        localStorage.removeItem(this.rememberMeKey);
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return api.hasToken() && !!this.getCurrentUser();
    }
}

// Export singleton instance
const authService = new AuthService();
