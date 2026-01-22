import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // NEW: Track initial auth check

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const { token, user } = await api.post('/auth/login', { email, password });

      const userData = { ...user, token };
      setUser(userData);
      localStorage.setItem('jobconnect_user', JSON.stringify(userData));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Let components handle UI feedback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    email,
    password,
    name,
    role,
    companyName
  ) => {
    setIsLoading(true);
    try {
      const { token, user } = await api.post('/auth/signup', {
        email,
        password,
        name,
        role,
        companyName
      });

      const userData = { ...user, token };
      setUser(userData);
      localStorage.setItem('jobconnect_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const socialLogin = useCallback(async (provider) => {
    setIsLoading(true);
    try {
      // Mock data generation based on provider
      const mockData = {
        provider,
        email: `mock-${provider}-user@example.com`, // Simulate unique email per provider
        name: `Mock ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };

      const { token, user } = await api.post('/auth/social-login', mockData);

      const userData = { ...user, token };
      setUser(userData);
      localStorage.setItem('jobconnect_user', JSON.stringify(userData));
      return user;
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('jobconnect_user');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('jobconnect_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Check for existing session on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('jobconnect_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('jobconnect_user');
      }
    }
    setIsInitializing(false); // Mark initialization complete
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      isInitializing, // NEW: Expose initialization state
      login,
      signup,
      logout,
      updateUser,
      socialLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
