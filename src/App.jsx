import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { storage } from './utils/StorageUtils';
import { seedTestReviews } from './utils/seedData';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import EmotionSelector from './components/EmotionSelector';
import CafeCard from './components/CafeCard';
import Button from './components/Button';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FavoritesPage from './pages/FavoritesPage';
import ChatBot from './components/ChatBot';
import { getRecommendations } from './utils/RecommendationEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Map as MapIcon, List } from 'lucide-react';
import { NavermapsProvider } from 'react-naver-maps';
import { LocationService } from './services/LocationService';
import NaverMapComponent from './components/NaverMapComponent';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedEmotion = searchParams.get('emotion');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    LocationService.getCurrentPosition()
      .then(setUserLocation)
      .catch((err) => console.log("Location access denied", err));
  }, []);

  const fetchNearbyCafes = async (emotionId, location) => {
    // Use refined fallback data (Curated Famous Korean Cafes)
    // Since we switched to Naver Maps and cannot use Google Places API concurrently efficiently without mixed billing/ToS issues,
    // and Naver Search requires backend proxy.
    setLoading(true);
    setTimeout(() => {
      setRecommendations(getRecommendations(emotionId, language));
      setLoading(false);
    }, 500);
  };

  const handleEmotionSelect = (emotionId) => {
    setSearchParams({ emotion: emotionId });
    setLoading(true);

    if (user) {
      storage.addLog(user.id, emotionId);
    }

    // Always fetch "real" data (from our curated engine)
    fetchNearbyCafes(emotionId, userLocation);
  };

  const resetSelection = () => {
    setSearchParams({});
    setRecommendations([]);
  };

  // Effect to load recommendations if URL has emotion on initial load
  useEffect(() => {
    if (selectedEmotion) {
      setLoading(true);
      setTimeout(() => {
        setRecommendations(getRecommendations(selectedEmotion, language));
        setLoading(false);
      }, 800);
    } else {
      setRecommendations([]);
    }
  }, [selectedEmotion, language]);

  return (
    <Layout>
      <div className="pb-12">


        <div className="space-y-12">
          {!selectedEmotion ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-heading text-primary relative inline-block">
                  {t('selectMood')}
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary/30 rounded-full"></span>
                </h1>
                <p className="text-muted text-lg max-w-2xl mx-auto font-light">
                  {t('subtitle')}
                </p>
              </div>

              <EmotionSelector onSelect={handleEmotionSelect} selected={selectedEmotion} />

              <AnimatePresence mode='wait'>
                {selectedEmotion && (
                  <motion.div
                    key={selectedEmotion}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-20"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-heading text-primary group flex items-center gap-3">
                          <span className="w-8 h-[2px] bg-secondary inline-block"></span>
                          Curated Collection
                        </h2>
                        <p className="text-muted mt-1 ml-11">
                          Perfect spots for your {selectedEmotion} vibe
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <ChatBot />
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex flex-col items-center justify-center space-y-4 py-8 border-b border-white/5">
                <h2 className="text-5xl font-heading text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  {t(selectedEmotion)} <span className="text-primary text-3xl font-action tracking-widest ml-2">COLLECTION</span>
                </h2>

                <div className="flex gap-4 items-center">
                  <Button variant="ghost" onClick={resetSelection} className="text-xs uppercase tracking-widest hover:text-secondary">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    {t('startOver')}
                  </Button>
                  <div className="h-4 w-px bg-primary/20" />
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    className="text-xs uppercase tracking-widest hover:text-secondary"
                  >
                    {viewMode === 'list' ? 'Map View' : 'List View'}
                    {viewMode === 'list' ? <MapIcon className="w-3 h-3 mr-2" strokeWidth={1.5} /> : <List className="w-3 h-3 mr-2" strokeWidth={1.5} />}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-32">
                  <div className="w-1 px-20 h-[1px] bg-primary/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary w-1/2 animate-[shimmer_1s_infinite]" />
                  </div>
                </div>
              ) : viewMode === 'map' ? (
                <div className="h-[500px] w-full bg-gray-50 rounded-lg overflow-hidden shadow-inner border border-primary/10">
                  {/* Utilize Naver Map via Provider Context if possible or just Component */}
                  <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAPS_CLIENT_ID}>
                    <NaverMapComponent
                      userLocation={userLocation}
                      cafes={recommendations}
                      onCafeSelect={(cafe) => {
                        // Deep link to Naver Map Search
                        const query = encodeURIComponent(cafe.name);
                        window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
                      }}
                    />
                  </NavermapsProvider>
                </div>
              ) : (
                <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((cafe, index) => (
                    <div
                      key={cafe.id}
                      className="transition-all duration-300 hover:-translate-y-1"
                    >
                      <CafeCard cafe={cafe} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

function App() {
  useEffect(() => {
    seedTestReviews();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

// Force rebuild for updates
