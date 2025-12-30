// Mock Database using localStorage

const USERS_KEY = 'moodbrew_users';
const LOGS_KEY = 'moodbrew_logs';
const FAVORITES_KEY = 'moodbrew_favorites';
const REVIEWS_KEY = 'moodbrew_reviews';

// Initialize default admin if not exists
const initStorage = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.find(u => u.email === 'admin@moodbrew.com')) {
        users.push({
            id: 'admin',
            email: 'admin@moodbrew.com',
            password: 'admin', // In real app, hash this!
            name: 'Admin User',
            role: 'admin',
            provider: 'local'
        });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

export const storage = {
    init: initStorage,

    // User methods
    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password && u.provider !== 'google');
        return user || null;
    },

    loginWithGoogle: (email, name) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        let user = users.find(u => u.email === email && u.provider === 'google');

        if (!user) {
            user = {
                id: 'google_' + Date.now(),
                email,
                name,
                role: 'user',
                provider: 'google',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            };
            users.push(user);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        return user;
    },



    register: (email, password, name, phoneNumber) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            phoneNumber,
            role: 'user',
            provider: 'local'
        };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return newUser;
    },

    getUsers: () => {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    },

    deleteUser: (id) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    },

    findUserForReset: (email, phoneNumber) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users.find(u => u.email === email && u.phoneNumber === phoneNumber && u.provider === 'local');
    },

    updatePassword: (userId, newPassword) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return true;
        }
        return false;
    },

    // Log methods
    addLog: (userId, emotion) => {
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const newLog = {
            id: Date.now(),
            userId,
            emotion,
            timestamp: new Date().toISOString()
        };
        logs.push(newLog);
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    },

    getLogs: () => {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    },

    getStats: () => {
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');

        // Count by emotion
        const emotionCounts = logs.reduce((acc, log) => {
            acc[log.emotion] = (acc[log.emotion] || 0) + 1;
            return acc;
        }, {});

        // Format for Recharts
        const emotionData = Object.entries(emotionCounts).map(([name, value]) => ({
            name,
            value
        }));

        // Recent activity (last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLogs = logs.filter(log => new Date(log.timestamp) > oneDayAgo);

        return {
            totalLogs: logs.length,
            emotionData,
            recentActivity: recentLogs.length
        };
    },

    // Favorites
    toggleFavorite: (userId, cafeId) => {
        let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        const existingIndex = favorites.findIndex(f => f.userId === userId && f.cafeId === cafeId);

        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1); // Remove
        } else {
            favorites.push({ userId, cafeId, timestamp: new Date().toISOString() }); // Add
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return existingIndex < 0; // Returns true if added, false if removed
    },

    getFavorites: (userId) => {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        return favorites.filter(f => f.userId === userId).map(f => f.cafeId);
    },

    // Reviews
    addReview: (userId, userName, cafeId, rating, comment) => {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        const newReview = {
            id: Date.now(),
            userId,
            userName,
            cafeId,
            rating,
            comment,
            timestamp: new Date().toISOString()
        };
        reviews.push(newReview);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        return newReview;
    },

    getReviews: (cafeId) => {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        return reviews.filter(r => r.cafeId === cafeId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    updateReview: (reviewId, rating, comment) => {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        const index = reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
            reviews[index] = { ...reviews[index], rating, comment, timestamp: new Date().toISOString() }; // Update timestamp on edit? Maybe keep original or add editedAt. Let's update timestamp for sorting.
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
            return true;
        }
        return false;
    },

    deleteReview: (reviewId) => {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        const filteredReviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(filteredReviews));
    },

    getCafeStats: (cafeId) => {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        const cafeReviews = reviews.filter(r => r.cafeId === cafeId);

        if (cafeReviews.length === 0) {
            return {
                averageRating: 0,
                reviewCount: 0,
                sentiment: 'neutral'
            };
        }

        const totalRating = cafeReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRating / cafeReviews.length).toFixed(1);

        // Sentiment Analysis
        const positiveCount = cafeReviews.filter(r => r.rating >= 4).length;
        const negativeCount = cafeReviews.filter(r => r.rating <= 2).length;

        let sentiment = 'neutral';
        if (positiveCount > negativeCount && positiveCount > cafeReviews.length * 0.5) {
            sentiment = 'positive';
        } else if (negativeCount > positiveCount && negativeCount > cafeReviews.length * 0.3) {
            sentiment = 'negative';
        }

        return {
            averageRating,
            reviewCount: cafeReviews.length,
            sentiment
        };
    }
};
