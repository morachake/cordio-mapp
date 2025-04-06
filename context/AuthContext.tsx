import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { LoginCredentials, RegisterCredentials, User } from '../types';
import * as SecureStore from 'expo-secure-store';
import {
  authReducer,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  registerRequest,
  registerSuccess,
  registerFailure
} from './authActions';

// Define local initial state to avoid circular dependency
const initialAuthState = {
  user: null,
  loading: false,
  error: null
};

// Auth context type with existing AuthState
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;  
  isLoggedIn: () => Promise<boolean>;     
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use environment variable or fallback for API URL
const API_URL = 'http://10.0.2.2:8081/api/v1/auth';

const parseJwt = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp < now;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  
  // Initialize auth state from secure storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        
        if (token && !isTokenExpired(token)) {
          const userData = await SecureStore.getItemAsync('user');
          if (userData) {
            dispatch(loginSuccess(JSON.parse(userData)));
          }
        } else if (token) {
          // Token expired, clear storage
          await Promise.all([
            SecureStore.deleteItemAsync('user'),
            SecureStore.deleteItemAsync('token')
          ]);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        await Promise.all([
          SecureStore.deleteItemAsync('user'),
          SecureStore.deleteItemAsync('token')
        ]);
      }
    };

    initializeAuth();
  }, []);

  // Token expiration timer
  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;
    
    const setupExpirationTimer = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;
      
      try {
        const decodedToken = parseJwt(token);
        if (!decodedToken?.exp) return;
        
        const expirationTime = decodedToken.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();
        
        if (timeUntilExpiration <= 0) {
          await logout();
          return;
        }
        
        logoutTimer = setTimeout(async () => {
          await logout();
        }, timeUntilExpiration);
      } catch (error) {
        console.error('Error setting up expiration timer:', error);
      }
    };
    
    setupExpirationTimer();
    
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [state.user]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch(loginRequest());
    console.log("Logging in with credentials:", credentials);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Login response data:", response);
      if (!data.token) {
        throw new Error("No token received from server");
      }
      const userData = { ...data };
      delete userData.token;
      await Promise.all([
        SecureStore.setItemAsync('user', JSON.stringify(userData)),
        SecureStore.setItemAsync('token', data.token)
      ]);
      dispatch(loginSuccess(userData));
      return true;
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'An error occurred'));
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    dispatch(registerRequest());
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.token) {
        throw new Error("No token received from server");
      }
      
      const userData = { ...data };
      delete userData.token;
      
      await Promise.all([
        SecureStore.setItemAsync('user', JSON.stringify(userData)),
        SecureStore.setItemAsync('token', data.token)
      ]);
      
      dispatch(registerSuccess(userData));
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      dispatch(registerFailure(err instanceof Error ? err.message : 'An error occurred'));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync('user'),
      SecureStore.deleteItemAsync('token')
    ]);
    
    dispatch(logoutAction());
  };

  const getToken = async (): Promise<string | null> => {
    const token = await SecureStore.getItemAsync('token');
    
    if (token && !isTokenExpired(token)) {
      return token;
    }
    
    if (token) {
      await logout();
    }
    
    return null;
  };

  const isLoggedIn = async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync('token');
    return token !== null && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: state.user,
        loading: state.loading,
        error: state.error,
        login, 
        register,
        logout, 
        getToken,
        isLoggedIn,
      }}
    >
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