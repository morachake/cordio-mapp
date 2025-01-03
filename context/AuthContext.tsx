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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState); 
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          SecureStore.getItemAsync('user'),
          SecureStore.getItemAsync('token')
        ]);

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          dispatch(loginSuccess(userData));;
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

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch(loginRequest());
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      console.log("Here is login res",data);
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
    if (state.user?.token) {
      return state.user.token;
    }
    return await SecureStore.getItemAsync('token');
  };

  const isLoggedIn = async () => {
    const token = await SecureStore.getItemAsync('token');
    return Boolean(token);
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