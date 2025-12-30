import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import CafeDetailsModal from './CafeDetailsModal';
import { MapPin, Coffee, Star, Heart, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/StorageUtils';
import { useLanguage } from '../context/LanguageContext';

const CafeCard = ({ cafe, onFavoriteChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0, sentiment: 'neutral' });
    const { user } = useAuth();
    const { t } = useLanguage();

    // Quick check for favorite icon display
    const isFavorite = user ? storage.getFavorites(user.id).includes(cafe.id) : false;

    // Load stats
    React.useEffect(() => {
        const cafeStats = storage.getCafeStats(cafe.id);
        if (cafeStats.reviewCount > 0) {
            setStats(cafeStats);
        } else {
            setStats({ ...cafeStats, averageRating: cafe.rating || "New" });
        }
    }, [cafe.id, showModal]);

    const handleGetDirections = (e) => {
        e.stopPropagation();
        if (cafe.coordinates) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.coordinates.lat},${cafe.coordinates.lng}`;
            window.open(url, '_blank');
        }
    };

    const getSentimentBadge = () => {
        if (stats.reviewCount === 0) return null;
        if (stats.sentiment === 'positive') {
            return <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/20">Positive Vibes</span>;
        } else if (stats.sentiment === 'negative') {
            return <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs border border-red-500/20">Mixed Reviews</span>;
        }
        return null;
    };

    return (
        <>
            <Card className="h-full flex flex-col group hover:border-primary/50 transition-colors relative bg-white/80">
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl group">
                    <img
                        src={cafe.image}
                        alt={cafe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {isFavorite && (
                        <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-accent z-10">
                            <Heart size={16} fill="currentColor" />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-primary font-heading">{cafe.name}</h3>
                        <div className="mt-1">
                            {getSentimentBadge()}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-2 py-1 rounded-lg">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-bold">{stats.averageRating}</span>
                        <span className="text-xs text-secondary/70 ml-0.5">({stats.reviewCount})</span>
                    </div>
                </div>

                <p className="text-muted text-sm mb-4 line-clamp-2 flex-1">
                    {cafe.description}
                </p>

                <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-text/80">
                        <Coffee size={16} className="text-secondary" />
                        <span>{Array.isArray(cafe.menu) ? cafe.menu[0]?.name : cafe.menu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text/80">
                        <MapPin size={16} className="text-secondary" />
                        <span>{cafe.distance} {t('away')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button
                            className="w-full text-sm col-span-2 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary border-0"
                            variant="outline"
                            onClick={() => setShowModal(true)}
                        >
                            View Details
                        </Button>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cafe.name + ' cafe')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button
                                className="w-full text-xs font-medium"
                                variant="ghost"
                            >
                                <span className="mr-1">Google</span>
                                <Navigation className="w-3 h-3" />
                            </Button>
                        </a>
                        <a
                            href={`https://map.naver.com/p/search/${encodeURIComponent(cafe.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button
                                className="w-full text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50"
                                variant="ghost"
                            >
                                <span className="mr-1">Naver</span>
                                <Navigation className="w-3 h-3" />
                            </Button>
                        </a>
                    </div>
                </div>
            </Card>

            <CafeDetailsModal
                cafe={cafe}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onFavoriteChange={onFavoriteChange}
            />
        </>
    );
};

export default CafeCard;
