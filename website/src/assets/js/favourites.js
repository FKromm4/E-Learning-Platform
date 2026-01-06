// ============================================
// FAVOURITES.JS - Favourites Service
// Manages user favourites via backend API
// ============================================

class FavouritesService {
    constructor() {
        this._cache = null;
        this._cacheTime = null;
        this._cacheDuration = 5000; // 5 seconds
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return typeof authService !== 'undefined' && authService.isAuthenticated();
    }

    /**
     * Clear the favourites cache
     */
    clearCache() {
        this._cache = null;
        this._cacheTime = null;
    }

    /**
     * Get favourites for current user from API
     * @param {boolean} forceRefresh - Force refresh from API
     * @returns {Promise<Object>} { courses: [], books: [] }
     */
    async getFavourites(forceRefresh = false) {
        if (!this.isAuthenticated()) {
            return { courses: [], books: [] };
        }

        // Check cache
        if (!forceRefresh && this._cache && this._cacheTime &&
            (Date.now() - this._cacheTime) < this._cacheDuration) {
            return this._cache;
        }

        const response = await api.get('/api/user/favourites', true);

        if (response.success && response.data) {
            this._cache = response.data;
            this._cacheTime = Date.now();
            return response.data;
        }

        return { courses: [], books: [] };
    }

    /**
     * Add item to favourites
     * @param {string} itemId - MongoDB _id of the item
     * @param {string} itemType - 'course' or 'book'
     * @returns {Promise<boolean>} Success
     */
    async addFavourite(itemId, itemType) {
        if (!this.isAuthenticated()) return false;

        // Backend expects singular type: 'course' or 'book'
        const type = itemType === 'course' ? 'course' : 'book';
        const response = await api.post(`/api/user/favourites/${type}/${itemId}`, {}, true);

        if (response.success) {
            this.clearCache();
            return true;
        }
        return false;
    }

    /**
     * Remove item from favourites
     * @param {string} itemId - MongoDB _id of the item
     * @param {string} itemType - 'course' or 'book'
     * @returns {Promise<boolean>} Success
     */
    async removeFavourite(itemId, itemType) {
        if (!this.isAuthenticated()) return false;

        // Backend expects singular type: 'course' or 'book'
        const type = itemType === 'course' ? 'course' : 'book';
        const response = await api.delete(`/api/user/favourites/${type}/${itemId}`, true);

        if (response.success) {
            this.clearCache();
            return true;
        }
        return false;
    }

    /**
     * Check if item is in favourites
     * @param {string} itemId - MongoDB _id of the item
     * @param {string} itemType - 'course' or 'book'
     * @returns {Promise<boolean>}
     */
    async isFavourite(itemId, itemType) {
        const favourites = await this.getFavourites();
        const key = itemType === 'course' ? 'courses' : 'books';
        return favourites[key].some(item => item._id === itemId);
    }

    /**
     * Toggle favourite state
     * @param {string} itemId - MongoDB _id of the item
     * @param {string} itemType - 'course' or 'book'
     * @returns {Promise<boolean>} New state (true = favourited, false = unfavourited)
     */
    async toggleFavourite(itemId, itemType) {
        const isFav = await this.isFavourite(itemId, itemType);

        if (isFav) {
            await this.removeFavourite(itemId, itemType);
            return false;
        } else {
            await this.addFavourite(itemId, itemType);
            return true;
        }
    }

    /**
     * Get favourite courses with full data
     * @returns {Promise<Array>} Array of course objects
     */
    async getFavouriteCourses() {
        const favourites = await this.getFavourites();
        return favourites.courses || [];
    }

    /**
     * Get favourite books with full data
     * @returns {Promise<Array>} Array of book objects
     */
    async getFavouriteBooks() {
        const favourites = await this.getFavourites();
        return favourites.books || [];
    }

    /**
     * Get all favourite items (courses and books)
     * @returns {Promise<Object>} { courses: [], books: [] }
     */
    async getAllFavouriteItems() {
        return await this.getFavourites();
    }
}

// Export singleton instance
const favouritesService = new FavouritesService();