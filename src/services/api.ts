import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('Interceptor: Nenhum token encontrado no AsyncStorage.');
      }
    } catch (error) {
      console.error('Interceptor: Erro ao ler token do AsyncStorage', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;