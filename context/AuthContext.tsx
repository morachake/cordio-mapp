import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
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
  getToken: () => string | null;  // Updated to sync instead of async
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
  const [token, setToken] = useState<string | null>(null);
  
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
            console.log("Stored token is expired, clearing authentication");
            await Promise.all([
              SecureStore.deleteItemAsync('user'),
              SecureStore.deleteItemAsync('token')
            ]);
            return;
          }
          
          const userData = JSON.parse(storedUser);
          dispatch(loginSuccess(userData));
          setToken(storedToken); // Store token in state
          console.log("Auth initialized with stored token");
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

  // Setup token expiration timer
  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;
    
    const setupExpirationTimer = async () => {
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          
          if (decodedPayload.exp) {
            const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
            const timeUntilExpiration = expirationTime - Date.now();
            
            // If token is already expired, logout immediately
            if (timeUntilExpiration <= 0) {
              console.log("Token expired, logging out");
              logoutUser();
              return;
            }
            
            // Set a timer to logout when token expires
            logoutTimer = setTimeout(() => {
              console.log("Token expiration timer triggered, logging out");
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
  }, [token]); // Re-run when token changes

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch(loginRequest());
    try {
      console.log("Making login request to:", `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Login successful, received data:", { ...data, token: data.token ? "TOKEN_RECEIVED" : "NO_TOKEN" });
      
      if (!data.token) {
        throw new Error("No token received from server");
      }
      
      // Store the token in memory state
      setToken(data.token);
      
      // Store user data and token in secure storage
      await Promise.all([
        SecureStore.setItemAsync('user', JSON.stringify(data)),
        SecureStore.setItemAsync('token', data.token)
      ]);
      
      dispatch(loginSuccess(data));
      return true;
    } catch (err) {
      console.error("Login error:", err);
      dispatch(loginFailure(err instanceof Error ? err.message : 'An error occurred'));
      return false;
    }
  };

  const logoutUser = async () => {
    console.log("Logging out user");
    // Clear token from memory
    setToken(null);
    
    // Clear from secure storage
    await Promise.all([
      SecureStore.deleteItemAsync('user'),
      SecureStore.deleteItemAsync('token')
    ]);
    
    dispatch(logout());
  };

  // Changed to sync to avoid issues with API calls
  const getToken = () => {
    // First check in-memory token which is most up-to-date
    if (token) {
      return token;
    }
    
    // Fallback to user object if available
    if (state.user?.token) {
      return state.user.token;
    }
    
    return null;
  };

  const isLoggedIn = async () => {
    // Check in-memory token first
    if (token && !isTokenExpired(token)) {
      return true;
    }
    
    // Fallback to storage
    const storedToken = await SecureStore.getItemAsync('token');
    if (!storedToken) return false;
    
    // Check if token is expired
    if (isTokenExpired(storedToken)) {
      // Clean up expired token
      await logoutUser();
      return false;
    }
    
    // If we have a valid stored token, update the in-memory token
    setToken(storedToken);
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