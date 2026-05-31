import axios from 'axios';
import { Platform } from 'react-native';

// ─── URL base ─────────────────────────────────────────────────────────────────
// Web: usa localhost
// Celular: substitua pelo IP atual da sua máquina (ipconfig → IPv4)

const baseURL = Platform.OS === 'web'
  ? 'http://localhost:8080/api'
  : 'https://handmade-mardi-obstruct.ngrok-free.dev/api';

export const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// ─── Interceptor de erros ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('⏱️ Timeout — backend demorou demais para responder');
    } else if (!error.response) {
      console.log('🔴 Sem resposta do servidor — verifique se o backend está rodando e o IP está correto');
      console.log('URL:', error.config?.url);
      console.log('baseURL:', baseURL);
    } else {
      console.log('❌ Erro da API:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);