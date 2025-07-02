import api from './api';
import type { AuthResponse } from '../types';
import type { LoginCredentials, RegisterPayload } from './types'; 


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => { 

  try {
    const response = await api.post<AuthResponse>('/api/auth/authenticate', credentials);
  
    return response.data;
  
  } catch (error: any) {

    console.error('Erro ao configurar a requisição:', error.message);
    
    throw error;
  }
  
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', { ...payload, frontendOrigin: 4 });
  return response.data;
};