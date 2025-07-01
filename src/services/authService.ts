import api from './api';
import type { AuthResponse } from '../types';
import type { LoginCredentials, RegisterPayload } from './types'; 


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {

  try {
    const response = await api.post<AuthResponse>('/api/auth/authenticate', credentials);
    console.log('Login bem-sucedido! Resposta da API:', JSON.stringify(response.data));
    
    return response.data;
  
  } catch (error: any) {
    // LOG 4: Se a chamada falhar, inspecionar o objeto de erro do Axios
    console.error('--- ERRO NO LOGIN ---');
    if (error.response) {
      // O servidor respondeu com um status de erro (4xx, 5xx)
      console.error('Status do Erro:', error.response.status);
      console.error('Dados do Erro:', JSON.stringify(error.response.data));
      console.error('Cabeçalhos do Erro:', JSON.stringify(error.response.headers));
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      // Isso geralmente indica um problema de rede/CORS/timeout
      console.error('Nenhuma resposta recebida. Verifique a conexão de rede ou a URL da API.');
      console.error('Requisição:', error.request);
    } else {
      // Um erro ocorreu ao configurar a requisição
      console.error('Erro ao configurar a requisição:', error.message);
    }
    console.error('--- FIM DO ERRO NO LOGIN ---');
    
    // Re-lança o erro para que o componente que chamou possa tratá-lo
    throw error;
  }
  
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', { ...payload, frontendOrigin: 3 });
  return response.data;
};