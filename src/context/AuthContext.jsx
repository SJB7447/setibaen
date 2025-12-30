import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/StorageUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('moodbrew_session');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem('moodbrew_session');
            }
        }
        storage.init();
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const user = storage.login(email, password);
        if (user) {
            setUser(user);
            localStorage.setItem('moodbrew_session', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const loginWithGoogle = (email, name) => {
        const user = storage.loginWithGoogle(email, name);
        if (user) {
            setUser(user);
            localStorage.setItem('moodbrew_session', JSON.stringify(user));
            return true;
        }
        return false;
    };



    const register = (email, password, name, phoneNumber) => {
        try {
            const newUser = storage.register(email, password, name, phoneNumber);
            setUser(newUser);
            localStorage.setItem('moodbrew_session', JSON.stringify(newUser));
            return true;
        } catch (error) {
            return false;
        }
    };

    const resetPassword = (email, phoneNumber, newPassword) => {
        const user = storage.findUserForReset(email, phoneNumber);
        if (user) {
            return storage.updatePassword(user.id, newPassword);
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('moodbrew_session');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, register, resetPassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
