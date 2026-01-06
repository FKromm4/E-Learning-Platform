// ============================================
// SUBSCRIPTION.JS - Subscription Service
// Manages user course enrollments using localStorage
// ============================================

class SubscriptionService {
    constructor() {
        this.storageKey = 'elearning_subscriptions';
    }

    getCurrentUserEmail() {
        const user = authService.getCurrentUser();
        return user ? user.email : null;
    }

    getAllSubscriptions() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    saveAllSubscriptions(allSubscriptions) {
        localStorage.setItem(this.storageKey, JSON.stringify(allSubscriptions));
    }

    getSubscriptions() {
        const email = this.getCurrentUserEmail();
        if (!email) return [];

        const allSubscriptions = this.getAllSubscriptions();
        return allSubscriptions[email] || [];
    }

    subscribe(courseId) {
        const email = this.getCurrentUserEmail();
        if (!email) return false;

        const allSubscriptions = this.getAllSubscriptions();
        if (!allSubscriptions[email]) {
            allSubscriptions[email] = [];
        }

        // Keep as string since MongoDB _id is a string
        const id = String(courseId);

        if (!allSubscriptions[email].includes(id)) {
            allSubscriptions[email].push(id);
            this.saveAllSubscriptions(allSubscriptions);
            return true;
        }
        return false;
    }

    unsubscribe(courseId) {
        const email = this.getCurrentUserEmail();
        if (!email) return false;

        const allSubscriptions = this.getAllSubscriptions();
        if (!allSubscriptions[email]) return false;

        // Keep as string since MongoDB _id is a string
        const id = String(courseId);
        const index = allSubscriptions[email].indexOf(id);

        if (index > -1) {
            allSubscriptions[email].splice(index, 1);
            this.saveAllSubscriptions(allSubscriptions);
            return true;
        }
        return false;
    }

    isSubscribed(courseId) {
        const subscriptions = this.getSubscriptions();
        // Keep as string since MongoDB _id is a string
        const id = String(courseId);
        return subscriptions.includes(id);
    }

    toggleSubscription(courseId) {
        if (this.isSubscribed(courseId)) {
            this.unsubscribe(courseId);
            return false;
        } else {
            this.subscribe(courseId);
            return true;
        }
    }
}

// Export singleton instance
const subscriptionService = new SubscriptionService();
