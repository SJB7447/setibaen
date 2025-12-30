import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, BarChart2, Globe, Heart, Shield } from 'lucide-react';

import Button from './Button';
import logo from '../assets/mood_brew_logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
                <Link to="/" className="flex items-center gap-2 text-3xl font-handwriting text-gradient">
                    <img src={logo} alt="Mood Brew Logo" className="h-12 w-auto mix-blend-screen rounded-full" />
                    {t('title')}
                </Link>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={toggleLanguage}
                        className="p-2 text-sm font-medium"
                    >
                        <Globe className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'KO' : 'EN'}
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted hidden md:block mr-2">
                                {t('welcome')}, {user.name}
                            </span>

                            {user.role === 'admin' && (
                                <Link to="/admin">
                                    <Button variant="ghost" className="p-2" title="Admin Dashboard">
                                        <BarChart2 className="w-5 h-5" />
                                    </Button>
                                </Link>
                            )}

                            <Link to="/favorites">
                                <Button variant="ghost" className="p-2 text-red-400 hover:text-red-300" title="My Favorites">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Button variant="ghost" onClick={handleLogout} className="p-2 text-muted hover:text-white" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary" className="px-4 py-2 text-sm">
                                {t('signIn')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
