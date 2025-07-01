import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Requisição: Adiciona o token de autenticação
// A função do interceptor agora é 'async' para poder usar 'await'
api.interceptors.request.use(
  async (config) => {
    try {
      // Lê o token do AsyncStorage de forma assíncrona
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Se o token existir, adiciona ao cabeçalho de autorização
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Interceptor: Token encontrado e adicionado ao cabeçalho.');
      } else {
        console.log('Interceptor: Nenhum token encontrado no AsyncStorage.');
      }
    } catch (error) {
      console.error('Interceptor: Erro ao ler token do AsyncStorage', error);
    }
    
    // Retorna a configuração (com ou sem o cabeçalho do token) para continuar a requisição
    return config;
  },
  (error) => {
    // Para erros na configuração da requisição
    return Promise.reject(error);
  }
);

export default api;