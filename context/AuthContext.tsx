import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LoginCredentials, RegisterCredentials, User } from '../types';
import * as SecureStore from 'expo-secure-store';
import {
  authReducer,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from './authActions';
import { initialState } from '@/reducer/appReducer';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  getToken: () => Promise<string | null>;  
  isLoggedIn: () => Promise<boolean>;     
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8081/api/v1/auth';

// Helper function to check if a token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens consist of three parts: header.payload.signature
    const payload = token.split('.')[1];
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    // Check if the token has an expiration time
    if (!decodedPayload.exp) return false;
    // Compare expiration timestamp with current time
    const now = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < now;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Consider invalid tokens as expired
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState); 
  
  // Initialize auth state from secure storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          SecureStore.getItemAsync('user'),
          SecureStore.getItemAsync('token')
        ]);

        if (storedUser && storedToken) {
          // Check if token is expired before restoring session
          if (isTokenExpired(storedToken)) {
            await Promise.all([
              SecureStore.deleteItemAsync('user'),
              SecureStore.deleteItemAsync('token')
            ]);
            return;
          }
          
          const userData = JSON.parse(storedUser);
          dispatch(loginSuccess(userData));
        }
      } catch {
        await Promise.all([
          SecureStore.deleteItemAsync('user'),
          SecureStore.deleteItemAsync('token')
        ]);
      }
    };

    initializeAuth();
  }, []);

  // Setup token expiration timer
  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;
    
    const setupExpirationTimer = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          
          if (decodedPayload.exp) {
            const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
            const timeUntilExpiration = expirationTime - Date.now();
            
            // If token is already expired, logout immediately
            if (timeUntilExpiration <= 0) {
              logoutUser();
              return;
            }
            
            // Set a timer to logout when token expires
            logoutTimer = setTimeout(() => {
              logoutUser();
            }, timeUntilExpiration);
            
            console.log(`Session will expire in ${Math.floor(timeUntilExpiration / 60000)} minutes`);
          }
        } catch (error) {
          console.error('Error setting up expiration timer:', error);
        }
      }
    };
    
    setupExpirationTimer();
    
    // Clean up timer on unmount
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [state.user]); // Re-run when user state changes

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch(loginRequest());
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      console.log("Here is login res", data);
      if (response.ok) {
        await Promise.all([
          SecureStore.setItemAsync('user', JSON.stringify(data)),
          SecureStore.setItemAsync('token', data.token)
        ]);
        dispatch(loginSuccess(data));
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'An error occurred'));
      return false;
    }
  };

  const logoutUser = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('user'),
      SecureStore.deleteItemAsync('token')
    ]);
    dispatch(logout());
  };

  const getToken = async () => {
    let token = state.user?.token;
    
    if (!token) {
      token = await SecureStore.getItemAsync('token');
    }
    
    if (token && isTokenExpired(token)) {
      await logoutUser();
      return null;
    }
    
    return token;
  };

  const isLoggedIn = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clean up expired token
      await logoutUser();
      return false;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...state, 
        login, 
        logout: logoutUser, 
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