import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
// @ts-ignore
import { useToast } from './ToastContext';
import { User, UserRole } from '../types/models';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.getMe();
                    setUser(response.user);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.login({ email, password });
            localStorage.setItem('token', response.token);
            // The response.user layout from login might differ slightly from getMe
            // Assuming AuthResponse matches api.ts definition
            setUser(response.user as User);

            // Redirect based on role
            switch (response.user.role) {
                case 'hospital': navigate('/hospital-dashboard'); break;
                case 'blood_bank': navigate('/blood-bank-dashboard'); break;
                case 'admin': navigate('/admin-dashboard'); break;
                case 'user':
                case 'donor': navigate('/donor-dashboard'); break;
                default: navigate('/');
            }

            showToast('Logged in successfully', 'success');
            return true;
        } catch (error: any) {
            showToast(error.message || 'Login failed', 'error');
            return false;
        }
    };

    const register = async (userData: any): Promise<boolean> => {
        try {
            const response = await api.register(userData);
            localStorage.setItem('token', response.token);
            setUser(response.user as User);
            showToast('Registration successful', 'success');
            return true;
        } catch (error: any) {
            showToast(error.message || 'Registration failed', 'error');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
        showToast('Logged out successfully', 'info');
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
