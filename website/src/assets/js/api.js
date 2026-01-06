/**
 * API.JS - Centralized API Service
 * Handles all communication with the backend REST API
 */

const API_CONFIG = {
    baseUrl: 'http://localhost:5000',
    tokenKey: 'elearning_token'
};

class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
        this.tokenKey = API_CONFIG.tokenKey;
    }

    /**
     * Get stored JWT token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
    }

    /**
     * Store JWT token
     * @param {string} token 
     * @param {boolean} remember - Use localStorage (persistent) or sessionStorage (session-only)
     */
    setToken(token, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        // Clear from both storages first
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenKey);
        // Set in appropriate storage
        storage.setItem(this.tokenKey, token);
    }

    /**
     * Clear stored token
     */
    clearToken() {
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenKey);
    }

    /**
     * Check if user has a valid token stored
     * @returns {boolean}
     */
    hasToken() {
        return !!this.getToken();
    }

    /**
     * Build request headers
     * @param {boolean} includeAuth - Include Authorization header
     * @returns {Object}
     */
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Make a GET request
     * @param {string} endpoint 
     * @param {boolean} requireAuth 
     * @returns {Promise<Object>}
     */
    async get(endpoint, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(requireAuth)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Make a POST request
     * @param {string} endpoint 
     * @param {Object} data 
     * @param {boolean} requireAuth 
     * @returns {Promise<Object>}
     */
    async post(endpoint, data = {}, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(requireAuth),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Make a PUT request
     * @param {string} endpoint 
     * @param {Object} data 
     * @param {boolean} requireAuth 
     * @returns {Promise<Object>}
     */
    async put(endpoint, data = {}, requireAuth = true) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(requireAuth),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint 
     * @param {boolean} requireAuth 
     * @returns {Promise<Object>}
     */
    async delete(endpoint, requireAuth = true) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(requireAuth)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Handle API response
     * @param {Response} response 
     * @returns {Promise<Object>}
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            // Handle 401 Unauthorized - clear token
            if (response.status === 401) {
                this.clearToken();
            }

            return {
                success: false,
                message: data.message || 'Σφάλμα επικοινωνίας με τον server.',
                status: response.status,
                data: null
            };
        }

        return data;
    }

    /**
     * Handle fetch errors (network issues, etc.)
     * @param {Error} error 
     * @returns {Object}
     */
    handleError(error) {
        console.error('API Error:', error);

        return {
            success: false,
            message: 'Αδυναμία σύνδεσης με τον server. Ελέγξτε τη σύνδεσή σας.',
            status: 0,
            data: null
        };
    }
}

// Export singleton instance
const api = new ApiService();
