// ============================================
// FAVOURITES.JS - Favourites Service
// Manages user favourites using localStorage
// ============================================

class FavouritesService {
    constructor() {
        this.storageKey = 'elearning_favourites';
    }

    /**
     * Get the current user's email
     * @returns {string|null}
     */
    getCurrentUserEmail() {
        const user = authService.getCurrentUser();
        return user ? user.email : null;
    }

    /**
     * Get all favourites from storage
     * @returns {Object} Map of userEmail -> { courses: [], books: [] }
     */
    getAllFavourites() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    /**
     * Save all favourites to storage
     * @param {Object} allFavourites
     */
    saveAllFavourites(allFavourites) {
        localStorage.setItem(this.storageKey, JSON.stringify(allFavourites));
    }

    /**
     * Get favourites for current user
     * @returns {Object} { courses: [], books: [] }
     */
    getFavourites() {
        const email = this.getCurrentUserEmail();
        if (!email) return { courses: [], books: [] };

        const allFavourites = this.getAllFavourites();
        return allFavourites[email] || { courses: [], books: [] };
    }

    /**
     * Add item to favourites
     * @param {number} itemId
     * @param {string} itemType - 'course' or 'book'
     * @returns {boolean} Success
     */
    addFavourite(itemId, itemType) {
        const email = this.getCurrentUserEmail();
        if (!email) return false;

        const allFavourites = this.getAllFavourites();
        if (!allFavourites[email]) {
            allFavourites[email] = { courses: [], books: [] };
        }

        const key = itemType === 'course' ? 'courses' : 'books';
        const id = parseInt(itemId);

        if (!allFavourites[email][key].includes(id)) {
            allFavourites[email][key].push(id);
            this.saveAllFavourites(allFavourites);
            return true;
        }
        return false;
    }

    /**
     * Remove item from favourites
     * @param {number} itemId
     * @param {string} itemType - 'course' or 'book'
     * @returns {boolean} Success
     */
    removeFavourite(itemId, itemType) {
        const email = this.getCurrentUserEmail();
        if (!email) return false;

        const allFavourites = this.getAllFavourites();
        if (!allFavourites[email]) return false;

        const key = itemType === 'course' ? 'courses' : 'books';
        const id = parseInt(itemId);
        const index = allFavourites[email][key].indexOf(id);

        if (index > -1) {
            allFavourites[email][key].splice(index, 1);
            this.saveAllFavourites(allFavourites);
            return true;
        }
        return false;
    }

    /**
     * Check if item is in favourites
     * @param {number} itemId
     * @param {string} itemType - 'course' or 'book'
     * @returns {boolean}
     */
    isFavourite(itemId, itemType) {
        const favourites = this.getFavourites();
        const key = itemType === 'course' ? 'courses' : 'books';
        const id = parseInt(itemId);
        return favourites[key].includes(id);
    }

    /**
     * Toggle favourite state
     * @param {number} itemId
     * @param {string} itemType - 'course' or 'book'
     * @returns {boolean} New state (true = favourited, false = unfavourited)
     */
    toggleFavourite(itemId, itemType) {
        if (this.isFavourite(itemId, itemType)) {
            this.removeFavourite(itemId, itemType);
            return false;
        } else {
            this.addFavourite(itemId, itemType);
            return true;
        }
    }

    /**
     * Get favourite courses with full data
     * @returns {Array} Array of course objects
     */
    getFavouriteCourses() {
        const favourites = this.getFavourites();
        return favourites.courses
            .map(id => getCourseById(id))
            .filter(course => course !== undefined);
    }

    /**
     * Get favourite books with full data
     * @returns {Array} Array of book objects
     */
    getFavouriteBooks() {
        const favourites = this.getFavourites();
        return favourites.books
            .map(id => getBookById(id))
            .filter(book => book !== undefined);
    }

    /**
     * Get all favourite items (courses and books)
     * @returns {Object} { courses: [], books: [] }
     */
    getAllFavouriteItems() {
        return {
            courses: this.getFavouriteCourses(),
            books: this.getFavouriteBooks()
        };
    }
}

// Export singleton instance
const favouritesService = new FavouritesService();

