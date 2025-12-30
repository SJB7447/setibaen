import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import PrivacyModal from '../components/PrivacyModal';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, KeyRound, Phone, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
    const [view, setView] = useState('login'); // 'login', 'register', 'forgot-password'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [error, setError] = useState('');

    // Password Reset State
    const [resetStep, setResetStep] = useState(1); // 1: Input, 2: Verify, 3: New Password
    const [verificationCode, setVerificationCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login, register, resetPassword, loginWithGoogle } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        // Simulate Google Popup delay
        const mockGoogleUser = {
            email: 'user@gmail.com',
            name: 'Google User'
        };

        if (loginWithGoogle(mockGoogleUser.email, mockGoogleUser.name)) {
            navigate('/');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (view === 'login') {
            if (login(email, password)) {
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } else if (view === 'register') {
            if (!privacyAccepted) {
                setError('You must agree to the Privacy Policy');
                return;
            }
            if (register(email, password, name, phoneNumber)) {
                navigate('/');
            } else {
                setError('Registration failed. User may already exist.');
            }
        }
    };

    const handleSendVerification = () => {
        if (!email || !phoneNumber) {
            setError('Please enter both email and phone number');
            return;
        }
        // Simulate SMS
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);
        alert(`[Simulated SMS] Your verification code is: ${code}`);
        setResetStep(2);
        setError('');
    };

    const handleVerifyCode = () => {
        if (inputCode === verificationCode) {
            setResetStep(3);
            setError('');
        } else {
            setError('Invalid verification code');
        }
    };

    const handleResetPassword = () => {
        if (resetPassword(email, phoneNumber, newPassword)) {
            alert('Password reset successful! Please login.');
            setView('login');
            setResetStep(1);
            setPassword('');
            setNewPassword('');
        } else {
            setError('Failed to reset password. User not found.');
        }
    };

    const renderForgotPassword = () => (
        <div className="space-y-4">
            {resetStep === 1 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                            placeholder="010-0000-0000"
                            required
                        />
                    </div>
                    <Button onClick={handleSendVerification} className="w-full">
                        Send Verification Code
                    </Button>
                </>
            )}

            {resetStep === 2 && (
                <>
                    <div className="text-center mb-4">
                        <p className="text-sm text-muted">Code sent to {phoneNumber}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Verification Code</label>
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors text-center tracking-widest text-lg"
                            placeholder="000000"
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={handleVerifyCode} className="w-full">
                        Verify Code
                    </Button>
                </>
            )}

            {resetStep === 3 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <Button onClick={handleResetPassword} className="w-full">
                        Reset Password
                    </Button>
                </>
            )}

            <button
                onClick={() => { setView('login'); setResetStep(1); setError(''); }}
                className="w-full text-sm text-muted hover:text-white mt-4"
            >
                Back to Login
            </button>
        </div>
    );

    return (
        <Layout>
            <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <div className="flex justify-center items-center min-h-[60vh] pt-16 relative">
                <div className="absolute top-20 left-4 md:left-20 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-muted hover:text-white p-2 flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Button>
                </div>

                <Card className="w-full max-w-md p-8 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold mb-2 text-gradient">
                            {view === 'login' && t('welcomeBack')}
                            {view === 'register' && t('joinUs')}
                            {view === 'forgot-password' && 'Reset Password'}
                        </h2>
                        <p className="text-muted">
                            {view === 'login' && t('signInDesc')}
                            {view === 'register' && t('signUpDesc')}
                            {view === 'forgot-password' && 'Verify your identity to reset password'}
                        </p>
                    </motion.div>

                    {view === 'forgot-password' ? renderForgotPassword() : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {view === 'register' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-1">{t('name')}</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="010-0000-0000"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">{t('email')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="hello@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">{t('password')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {view === 'register' && (
                                <div className="flex items-center gap-2 py-2">
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        checked={privacyAccepted}
                                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                        className="rounded border-white/10 bg-background text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="privacy" className="text-sm text-muted">
                                        I agree to the <button type="button" onClick={() => setShowPrivacy(true)} className="text-primary hover:underline">Privacy Policy</button>
                                    </label>
                                </div>
                            )}

                            {error && (
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            )}

                            <Button type="submit" className="w-full">
                                {view === 'login' ? (
                                    <>
                                        <LogIn className="w-4 h-4" /> {t('signIn')}
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" /> {t('createAccount')}
                                    </>
                                )}
                            </Button>

                            {view === 'login' && (
                                <>
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-[#1e293b] text-muted">Or continue with</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Sign in with Google
                                    </button>
                                </>
                            )}
                        </form>
                    )}

                    <div className="mt-6 text-center space-y-2">
                        {view === 'login' && (
                            <>
                                <button
                                    onClick={() => setView('forgot-password')}
                                    className="text-sm text-muted hover:text-white block w-full"
                                >
                                    Forgot password?
                                </button>
                                <p className="text-sm text-muted">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setView('register')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </>
                        )}
                        {(view === 'register' || view === 'forgot-password') && (
                            <p className="text-sm text-muted">
                                Already have an account?{' '}
                                <button
                                    onClick={() => setView('login')}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default LoginPage;
