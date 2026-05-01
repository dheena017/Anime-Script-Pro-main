import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const AUTH_REQUEST_TIMEOUT_MS = 5000;

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: AUTH_REQUEST_TIMEOUT_MS
      });
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user with token:", err);
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for backend token
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        await fetchCurrentUser(token);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('auth_token', access_token);
      } else {
        sessionStorage.setItem('auth_token', access_token);
      }
      
      await fetchCurrentUser(access_token);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};


