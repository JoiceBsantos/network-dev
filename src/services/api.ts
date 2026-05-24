import axios from 'axios';
import { Platform } from 'react-native';

// IMPORTANTE: Se estiver usando celular físico, substitua '10.173.27.34' 
// pelo IP atual da sua máquina (comando ipconfig no terminal)
const baseURL = Platform.OS === 'web' 
  ? 'http://localhost:8080/api' 
  : 'http://10.173.27.34:8080/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});