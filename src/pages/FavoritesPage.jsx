import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import CafeCard from '../components/CafeCard';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/StorageUtils';
import { getRecommendations } from '../utils/RecommendationEngine';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const FavoritesPage = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadFavorites = () => {
        const favIds = storage.getFavorites(user.id);
        // In a real app, we'd fetch by IDs. Here we'll scan all recommendations to find matches.
        // Since getRecommendations returns a subset, we might miss some if we don't have a "getAllCafes"
        // For this demo, we'll iterate through all emotions to find the cafe objects.

        const allCafes = [];
        ['happy', 'sad', 'stressed', 'tired', 'energetic'].forEach(emotion => {
            allCafes.push(...getRecommendations(emotion, 'en'));
        });

        // Deduplicate by ID
        const uniqueCafes = Array.from(new Map(allCafes.map(item => [item.id, item])).values());

        const userFavorites = uniqueCafes.filter(cafe => favIds.includes(cafe.id));
        setFavorites(userFavorites);
        setLoading(false);
    };

    if (!user) {
        return (
            <Layout>
                <div className="pt-20 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Please login to view favorites</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="pt-16">
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
                            <Heart className="fill-red-500 text-red-500" />
                            My Favorites
                        </h1>
                    </div>
                    <p className="text-muted ml-14">Your curated collection of coffee spots</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {favorites.map((cafe, index) => (
                            <motion.div
                                key={cafe.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CafeCard cafe={cafe} onFavoriteChange={loadFavorites} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl">
                        <Heart className="w-16 h-16 text-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                        <p className="text-muted">Start exploring and heart the places you love!</p>
                        <Button onClick={() => navigate('/')} className="mt-4">Explore Cafes</Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FavoritesPage;
