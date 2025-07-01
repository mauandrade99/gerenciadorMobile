import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, JwtPayload } from '../types';
import { getUserById } from '../services/userService';

// A interface não muda
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserFromToken = useCallback(async (currentToken: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(currentToken);

      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expirado");
      }

      const userProfile = await getUserById(decoded.userId);
      setUser(userProfile);
      setIsAdmin(userProfile.role === 'ROLE_ADMIN');
      setToken(currentToken);
    } catch (error) {
      console.error("Falha ao carregar usuário a partir do token:", error);
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  console.log('[AuthProvider] Montado. isLoading:', isLoading, 'token:', token);

  // Efeito para verificar o token no armazenamento ao iniciar o app
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          await loadUserFromToken(storedToken);
        }
      } catch (error) {
        console.error("Falha ao ler token do AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredToken();
  }, [loadUserFromToken]);

  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('authToken', newToken);
      await loadUserFromToken(newToken);
    } catch (error) {
      console.error("Falha ao salvar token no AsyncStorage", error);
    }
  };

  const logout = async () => {
    console.log('[AuthProvider] Logout chamado.');
    try {
      await AsyncStorage.removeItem('authToken');
      console.log('[AuthProvider] Token removido do AsyncStorage.');
      
      // Força a atualização dos estados de forma explícita e imediata
      setToken(null);
      setUser(null);
      setIsAdmin(false);
      
      console.log('[AuthProvider] Estados de autenticação resetados.');
    } catch (error) {
      console.error("AuthProvider: Falha ao remover token do AsyncStorage", error);
    }
    // Não precisamos mais do 'finally' aqui, pois a lógica principal está no 'try'
  };

  const value = {
    isAuthenticated: !!token && !!user,
    user,
    isAdmin,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};