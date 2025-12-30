import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, Send, User, Pencil, Trash2 } from 'lucide-react';
import { storage } from '../utils/StorageUtils';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const CafeDetailsModal = ({ cafe, onClose, isOpen, onFavoriteChange }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0, sentiment: 'neutral' });

    useEffect(() => {
        if (isOpen && cafe) {
            loadData();
            resetForm();
        }
    }, [isOpen, cafe, user]);

    const loadData = () => {
        setReviews(storage.getReviews(cafe.id));
        setStats(storage.getCafeStats(cafe.id));
        if (user) {
            const favorites = storage.getFavorites(user.id);
            setIsFavorite(favorites.includes(cafe.id));
        }
    };

    const resetForm = () => {
        setNewReview('');
        setRating(5);
        setEditingReviewId(null);
    };

    const handleToggleFavorite = () => {
        if (!user) {
            alert('Please login to add favorites');
            return;
        }
        const isNowFavorite = storage.toggleFavorite(user.id, cafe.id);
        setIsFavorite(isNowFavorite); // toggleFavorite returns true if added (is now favorite)

        if (onFavoriteChange) {
            onFavoriteChange(isNowFavorite);
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to write a review');
            return;
        }
        if (!newReview.trim()) return;

        if (editingReviewId) {
            storage.updateReview(editingReviewId, rating, newReview);
        } else {
            storage.addReview(user.id, user.name, cafe.id, rating, newReview);
        }

        resetForm();
        loadData();
    };

    const handleEditClick = (review) => {
        setNewReview(review.comment);
        setRating(review.rating);
        setEditingReviewId(review.id);
    };

    const handleDeleteClick = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            storage.deleteReview(reviewId);
            loadData();
            if (editingReviewId === reviewId) {
                resetForm();
            }
        }
    };

    // if (!isOpen || !cafe) return null; // Removed early return

    // Use Portal to render modal outside of the parent card hierarchy (which has transforms)
    return isOpen && cafe ? (
        createPortal(
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image */}
                        <div className="relative h-48 sm:h-64">
                            <img
                                src={cafe.image}
                                alt={cafe.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-colors text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{cafe.name}</h2>
                                    <div className="text-primary font-medium mb-2">
                                        {Array.isArray(cafe.menu) ? (
                                            <div className="flex flex-wrap gap-2">
                                                {cafe.menu.map((item, idx) => (
                                                    <span key={idx} className="bg-primary/10 px-2 py-1 rounded text-sm">
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            cafe.menu
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold">{stats.averageRating || (cafe.rating || "New")}</span>
                                            <span className="text-xs text-muted ml-1">({stats.reviewCount} reviews)</span>
                                        </div>
                                        {stats.sentiment === 'positive' && (
                                            <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/20">
                                                Generally Positive
                                            </span>
                                        )}
                                        {stats.sentiment === 'negative' && (
                                            <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/20">
                                                Mixed Reviews
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-muted hover:text-white'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <p className="text-gray-300 mb-8 leading-relaxed">
                                {cafe.description}
                            </p>

                            {/* Reviews Section */}
                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    Reviews ({reviews.length})
                                </h3>

                                {/* Review Form */}
                                {user ? (
                                    <form onSubmit={handleSubmitReview} className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                                    >
                                                        <Star className={`w-5 h-5 ${rating >= star ? 'fill-current' : ''}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            {editingReviewId && (
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="text-xs text-muted hover:text-white"
                                                >
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                                placeholder={editingReviewId ? "Update your review..." : "Share your thoughts..."}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                                            />
                                            <Button type="submit">
                                                {editingReviewId ? 'Update' : <Send className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mb-8 p-4 bg-white/5 rounded-xl text-center text-sm text-muted">
                                        Please login to write a review
                                    </div>
                                )}

                                {/* Review List */}
                                <div className="space-y-4">
                                    {reviews.length === 0 ? (
                                        <p className="text-center text-muted py-4">No reviews yet. Be the first!</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review.id} className={`p-4 rounded-xl transition-colors ${editingReviewId === review.id ? 'bg-primary/10 border border-primary/20' : 'bg-white/10'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                            <User size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">
                                                                {review.userName}
                                                                {user && user.id === review.userId && <span className="text-xs text-muted ml-2">(You)</span>}
                                                            </p>
                                                            <div className="flex text-yellow-400 text-xs">
                                                                {[...Array(review.rating)].map((_, i) => (
                                                                    <Star key={i} size={10} fill="currentColor" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted">
                                                            {new Date(review.timestamp).toLocaleDateString()}
                                                        </span>
                                                        {user && user.id === review.userId && (
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleEditClick(review)}
                                                                    className="p-1 text-muted hover:text-primary transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(review.id)}
                                                                    className="p-1 text-muted hover:text-red-400 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-100 text-base leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>,
            document.body
        )
    ) : null;
};

export default CafeDetailsModal;
