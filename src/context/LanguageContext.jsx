import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Navbar
        signIn: "Sign In",
        signOut: "Sign Out",

        // Home
        title: "Mood Brew",
        subtitle: "Tell us how you feel, and we'll find the perfect spot and sip for you.",
        curatedFor: "Curated for your",
        mood: "mood",
        startOver: "Start Over",

        // Emotions
        happy: "Happy",
        sad: "Melancholy",
        stressed: "Stressed",
        tired: "Tired",
        excited: "Excited",

        // Cafe Card
        away: "away",
        recommended: "Recommended for you",
        getDirections: "Get Directions",

        // Login
        welcomeBack: "Welcome Back",
        joinUs: "Join Mood Brew",
        signInDesc: "Sign in to track your mood journey",
        signUpDesc: "Create an account to get started",
        name: "Name",
        email: "Email",
        password: "Password",
        createAccount: "Create Account",
        haveAccount: "Already have an account? Sign in",
        noAccount: "Don't have an account? Sign up",

        // Admin
        dashboard: "Dashboard",
        dashboardDesc: "Overview of user activity and emotion trends",
        totalLogs: "Total Logs",
        recentActivity: "Recent Activity (24h)",
        activeUsers: "Active Users",
        emotionDist: "Emotion Distribution",
        popularMoods: "Popular Moods",
    },
    ko: {
        // Navbar
        signIn: "로그인",
        signOut: "로그아웃",

        // Home
        title: "무드 브루",
        subtitle: "오늘의 기분을 알려주세요. 당신에게 딱 맞는 공간과 메뉴를 찾아드릴게요.",
        curatedFor: "당신의",
        mood: "기분을 위한 추천",
        startOver: "다시 선택하기",

        // Emotions
        happy: "행복해요",
        sad: "우울해요",
        stressed: "스트레스",
        tired: "피곤해요",
        excited: "신나요",

        // Cafe Card
        away: "거리",
        recommended: "추천 메뉴",
        getDirections: "길찾기",

        // Login
        welcomeBack: "환영합니다",
        joinUs: "무드 브루 시작하기",
        signInDesc: "로그인하고 나만의 감정 여정을 기록하세요",
        signUpDesc: "계정을 만들고 시작해보세요",
        name: "이름",
        email: "이메일",
        password: "비밀번호",
        createAccount: "계정 만들기",
        haveAccount: "이미 계정이 있으신가요? 로그인",
        noAccount: "계정이 없으신가요? 회원가입",

        // Admin
        dashboard: "대시보드",
        dashboardDesc: "사용자 활동 및 감정 트렌드 개요",
        totalLogs: "총 기록 수",
        recentActivity: "최근 활동 (24시간)",
        activeUsers: "활성 사용자",
        emotionDist: "감정 분포",
        popularMoods: "인기 있는 기분",
    }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('moodbrew_lang');
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ko' : 'en';
        setLanguage(newLang);
        localStorage.setItem('moodbrew_lang', newLang);
    };

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
